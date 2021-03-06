const config = require('./js/config');
var menu = $('#appMenu'),
		toolbar = $('#toolbar'),
		leftFade = $('#leftFade'),
		dragArea = $('#draggable'),
		rightFade = $('#rightFade'),
		preview = $('#previewPanel'),
		editor = $('.CodeMirror-wrap'),
		syncScroll = $('#syncScrollToggle');

let opts = [
	{ name: 'showMenu', action: () => { toggleMenu(); }},
	{ name: 'showToolbar', action: () => { toggleToolbar(); }},
	{ name: 'showPreview', action: () => { togglePreview(); }},
	{ name: 'syncScroll' },
	{ name: 'lineNumbers', action: () => { toggleLineNumbers(); }},
	{ name: 'dynamicEditor', action: () => { toggleDynamicFont(); }},
	{ name: 'matchBrackets', action: () => { toggleMatchBrackets(); }},
	{ name: 'showTrailingSpace', action: () => { toggleWhitespace(); }},
	{ name: 'previewProfile', action: () => { setPreviewProfile(); }},
	{ name: 'customCSS', action: () => { toggleCustomCSS(); }},
	{ name: 'showTooltips', action: () => { toggleTooltips(); }},
	{ name: 'mathRendering' }, { name: 'editorFontSize' },
	{ name: 'enableSpellCheck' }, { name: 'previewMode' },
	{ name: 'previewFontSize' }, { name: 'hideYAMLFrontMatter' },
	{ name: 'frontMatterTemplate' }, { name: 'keepInTray' }
];

function getUserSettings() {
	// If no setting for option, sets default
	opts.forEach((setting) => {
		if(!settings.has(setting.name))
			settings.set(setting.name, config.get(setting.name));
	});
	setPreviewMode(settings.get('previewMode'));
	setPreviewProfile(settings.get('previewProfile'));
	opts.forEach(applySettings);
	formatHead();
	syncScrollCheck();
	if(process.platform === 'darwin') {
		$('.btn-group').remove();
		$('#menuToggle').remove();
		$('#metacity').hide();
	}
}

function applySettings(opt) {
	var selector = $('#'+opt.name),
			input = selector.find('input'),
			type = input.attr('type');
	if(settings.get(opt.name) && opt.action)
		opt.action();
	if(type === 'checkbox') {
		if(selector.length && input.length) {
			if(input.is(':checked') !== settings.get(opt.name))
				input.prop('checked', !input.prop('checked'));
		}
	} else if(type === 'text') {
		input.val(settings.get(opt.name));
	}
	$('#textPanel > div').css('font-size', settings.get('editorFontSize')+'px');
  $('#mdPreview').css('font-size', settings.get('previewFontSize')+'px');
	$('#editorFontSize-input').val(settings.get('editorFontSize'));
	$('#previewFontSize-input').val(settings.get('previewFontSize'));
}

function syncScrollCheck() {
	if(settings.get('syncScroll'))
		syncScroll.attr('class', 'fa fa-link');
	else
		syncScroll.attr('class', 'fa fa-unlink');
	toggleSyncScroll;
}

var formatHead = () => {
	var textPanel = $('#textPanel'),
			menuToggle = $('#menuToggle');
	if(process.platfrom === 'darwin') {
		preview.css('paddingTop', '25px');
		if(toolbar.is(':visible') !== menu.is(':visible')) {
			toggleMenu();
		}
	}
	if(menu.is(':visible')) {
		toolbar.css('top', '26px');
		dragArea.css('width', '-webkit-calc(100% - 255px)');
		menuToggle.hide();
		if(toolbar.is(':visible')) {
			menu.css('box-shadow', 'none');
			textPanel.css('paddingTop', '40px');
			preview.css('paddingTop', '40px');
		} else {
      menu.css('box-shadow', 'none');
			textPanel.css('paddingTop', '3px');
			preview.css('paddingTop', '35px');
		}
	} else {
		toolbar.css('top', '0');
		if(toolbar.is(':visible')) {
			dragArea.css('width', '-webkit-calc(50% - 50px)');
			editor.css('paddingTop', '9px');
			textPanel.css('paddingTop', '15px');
		} else {
			menuToggle.show();
			dragArea.css({ 'width': 'calc(100% - 117px)' });
			editor.css('paddingTop', '5px');
			textPanel.css('paddingTop', '0px');
			if(settings.get('previewMode') === 'markdown')
				preview.css('paddingTop', '30px');
		}
	}
};

function adaptTheme(color, luminosity) {
	var menuButton = $('#menuButton');
	leftFade.css('background','-webkit-linear-gradient(top, '+color+' 35%, transparent)');
	if(luminosity >= 0.6) {
		menuButton.css('color', 'rgba(50, 50, 50, 0.1)');
		menuButton.mouseover(function() {
			$(this).css('color', 'rgba(50, 50, 50, 0.3)');
		}).mouseout(function() {
			$(this).css('color', 'rgba(50, 50, 50, 0.1)');
		});
    $('.CodeMirror-matchingbracket').css('background', 'rgba(255,255,255,0.2)');
    $('.CodeMirror-matchingbracket').css('background', 'rgba(255,255,255,0.1)');
	} else {
		menuButton.css('color', 'rgba(255, 255, 255, 0.07)');
		menuButton.mouseover(function() {
			$(this).css('color', 'rgba(255, 255, 255, 0.35)');
		}).mouseout(function() {
			$(this).css('color', 'rgba(255, 255, 255, 0.07)');
		});
    $('.CodeMirror-matchingbracket').css('background', 'rgba(50,50,50,0.4)');
    $('.CodeMirror-matchingbracket').css('background', 'rgba(50,50,50,0.2)');
	}
}

function toggleMenu() {
	var winButtons = $('#metacity').children('button');
	if(menu.attr('class').includes('hidden')) {
		menu.attr('class', 'slideInDown');
		menu.css('visibility', 'visible');
		menu.css('height', '27px');
		winButtons.css('marginTop', '2px');
		winButtons.css('marginBottom', '4px');
		$('#editArea').css('paddingTop', '0px');
		settings.set('showMenu', true);
	} else {
		menu.attr('class', 'hidden slideInDown');
		menu.css('visibility', 'hidden');
		menu.css('height', '0px');
		winButtons.css('marginTop', '3px');
		winButtons.css('marginBottom', '3px');
		settings.set('showMenu', false);
	}
	formatHead();
}

var toggleToolbar = () => {
	if(toolbar.is(':visible')) {
		toolbar.css('display', 'none');
		settings.set('showToolbar', false);
	} else {
		toolbar.css('display', 'block');
		settings.set('showToolbar', true);
	}
	if( process.platform === 'darwin') {
		if(toolbar.is(':visible') !== menu.is(':visible'))
			toggleMenu();
	}
	formatHead();
};

function togglePreview() {
	let leftPanel = $('#leftPanel'),
			rightPanel = $('#rightPanel'),
			previewToggle = $('#previewToggle');
	if(preview.is(':visible')) {
		preview.css('display', 'none');
		leftPanel.width('100%');
		rightPanel.css('right', '-50%');
		leftFade.width('100%');
		rightFade.hide();
		syncScroll.hide();
    // syncScroll.css('color', '#444444');
		previewToggle.attr('class', 'fa fa-eye-slash');
		settings.set('showPreview', false);
	} else {
		preview.css('display', 'block');
		leftPanel.width('50%');
		rightPanel.css('right', '0');
		leftFade.width('50%');
		rightFade.show();
		syncScroll.show();
		previewToggle.attr('class', 'fa fa-eye');
		settings.set('showPreview', true);
	}
	formatHead();
	manageWindowSize();
}

function setPreviewMode(opt) {
	var markdown = $('#mdPreview'),
			html = $('#htmlPreview'),
			htmlText = '';
	if(markdown.is(':visible') && opt === 'read') {
		$('#rightPanel').css('width','100%');
		$('#leftPanel').hide();
		$('leftFade').hide();
		$('#previewPanel').css('paddingLeft', '5%');
		$('#previewPanel').css('paddingRight', '5%');
	}
  if(markdown.is(':visible') && opt === 'html') {
		markdown.hide();
		html.show();
		htmlText = html[0].innerHTML.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
		html.text(htmlText);
		preview.css('padding', '0');
    preview.css('paddingTop', '0', '!important');
		preview.css('overflow', 'hidden');
	} else if(html.is(':visible') && opt !== 'html') {
		html.hide();
		markdown.show();
		preview.css('padding', '30px 15px 27px');
		preview.css('overflow-y', 'auto');
	}
	settings.set('previewMode', opt);
}

function setPreviewProfile(profile) {
	var profileTag = $('#profileTag'),
			current = profileTag.attr('href').slice(14,-4);
	if(!profile)
		profile = settings.get('previewProfile');
	if(current !== profile.toLowerCase()) {
		profileTag.attr('href', 'assets/css/preview/'+profile.toLowerCase()+'.css');
	}
	settings.set('previewProfile', profile.toString());
	$('#previewProfile').attr('title', profile);
}

function toggleCustomCSS() {
	var state = settings.get('customCSS'),
			file = path.join('assets','css','preview','custom.css'),
			tag = $('#customCSSTag');
	if(!state)
		tag.remove();
	if(state) {
		if(!tag.length) {
			tag = document.createElement('link');
			tag.setAttribute('rel', 'stylesheet');
			tag.setAttribute('id', 'customCSSTag');
			tag.setAttribute('href', file);
			$('head').append(tag);
		}
		fs.readFile(file, 'utf-8', (err, data) => {
			if(err)
				return notify('An error ocurred while accessing the custom CSS file', 'error');
			if(data.toString().length < 6) {
				$('#custom-css-modal').modal();
				if($('#settingsMenu').css('left') < 0)
					toggleSettingsMenu();
			} else {
				$('#custom-css').attr('value', data);
			}
		});
	}
	settings.get('customCSS', !state);
}

function toggleLineNumbers() {
	if(state) {
		$('.CodeMirror-code > div').css('padding-left', '22px');
		$('.CodeMirror-gutters').show();
	} else {
		$('.CodeMirror-code > div').css('padding-left', '15px');
		$('.CodeMirror-gutters').hide();
	}
	cm.setOption('lineNumbers', settings.get('lineNumbers'));
}

function toggleDynamicFont() {
	var head = document.getElementsByTagName('head')[0],
			tag;
	if(settings.get('dynamicEditor')) {
		tag = document.createElement('link');
		tag.setAttribute('id', 'dynamicTag');
		tag.setAttribute('rel', 'stylesheet');
		tag.setAttribute('href', 'assets/css/dynamicEditor.css');
		head.appendChild(tag);
	} else {
		$('#dynamicTag').remove();
		// $('#dynamicTag').attr('href', 'assets/css/style.css');
	}
}

function toggleMatchBrackets() {
	var state = settings.get('matchBrackets');
	if(cm === undefined) return;
	else if(state !== cm.getOption('autoCloseBrackets')) {
		cm.setOption('autoCloseBrackets', state);
		cm.setOption('autoCloseTags', state);
	}
}

function toggleWhitespace() {
	if(settings.get('showTrailingSpace')) {
		$('.cm-trailing-space-a').css('text-decoration', 'underline');
		$('.cm-trailing-space-new-line').css('text-decoration', 'underline');
	} else {
		$('.cm-trailing-space-a').css('text-decoration', 'none');
		$('.cm-trailing-space-new-line').css('text-decoration', 'none');
	}
}

function setFrontMatterTemplate() {
	storage.get('markdown-savefile', (err) => {
		if(err) notify(err, 'error');
		var options = {
			'properties': ['openFile'],
			'filters': [
				{ name: 'All', 'extensions': ['yaml', 'yml', 'md', 'markdown', 'txt', 'text'] },
				{ name: 'YAML', 'extensions': ['yaml', 'yml'] },
				{ name: 'Markdown', 'extensions': ['md', 'markdown'] },
				{ name: 'Text', 'extensions': [ 'txt', 'text'] }
			]
		};
		dialog.showOpenDialog(options, (file) => {
			if(file === undefined)
				return notify('You didn\'t select a file', 'warning');
			fs.readFile(file[0], 'utf-8', (err) => {
				if(err)
					notify('An error ocurred while opening the file '+err.message, 'error');
				settings.set('frontMatterTemplate', file[0]);
			});
		});
	});
}


function toggleTooltips() {
	if(!settings.get('showTooltips')) {
    $('[data-tooltip]').removeAttr('data-tooltip');
	}
}

function manageWindowSize() {
	var codeMirror = $('.CodeMirror-sizer');
	if(preview.is(':visible') && $('.toolbar-buttons').height() > 40) {
		toolbar.css('width', '100%');
		codeMirror.css('margin-right', '8px');
		if(!menu.is(':visible') && toolbar.is(':visible'))
			dragArea.css('width','calc(36% - 50px)');
	} else {
		toolbar.css('width', '50%');
		codeMirror.css('margin-right', '0');	
	}
	settings.set('windowWidth', parseInt($('#body').width(),10));
	settings.set('windowHeight', parseInt($(window).height(),10));
}

// Handle settingsMenu changes
$('#editorFontSize-input, #editorFontSize-up, #editorFontSize-down').bind('keyup mouseup', function() {
	var value = parseFloat($('#editorFontSize-input').val());
	$('#textPanel > div').css('fontSize', value.toString()+'px');
	settings.set('editorFontSize', value);
});

$('#editorTheme').on('changed.bs.select', function(e) {
	var theme = $(e.currentTarget).val().toLowerCase().replace(/ /g,'-');
	setEditorTheme(theme);
});

$('#previewProfile').on('changed.bs.select', function(e) {
	var profile = $(e.currentTarget).val();
	$('#previewProfile').attr('title', profile);
	setPreviewProfile(profile);
});

$('#previewMode').on('changed.bs.select', function(e) {
	var mode = $(e.currentTarget).val().toLowerCase();
	setPreviewMode(mode);
});

$('#previewFontSize-input, #previewFontSize-up, #previewFontSize-down').bind('keyup mouseup', function() {
	var value = parseFloat($('#previewFontSize-input').val());
	$('#mdPreview').css('fontSize', value.toString()+'px');
	settings.set('previewFontSize', value);
});

$('#yamlPath').on('click', () => { setFrontMatterTemplate(); });

// Settings menu toggle listeners
var changes = [];
$('.switch__input').change(function() {
	var val = $(this).is(':checked'),
			setting = $(this).attr('setting');
	opts.forEach((temp) => {
		if(temp.name === setting) {
			if(temp.action)
				temp.action();
			settings.set(setting, val);
		}
	});
	if($(this).hasClass('require-reload') && !$('.alert-info').is(':visible')) {
		notify('This change will take effect once the app has been reloaded (ctrl+r)', 'info');
	}
	changes.push(setting);
});
