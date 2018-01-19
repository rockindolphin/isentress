var gulp = require('gulp'),
	path = require('path'),
	del = require('del'),
	less = require('gulp-less'),
	sourcemaps = require('gulp-sourcemaps'),
	LessAutoprefix = require('less-plugin-autoprefix'),
	cleanCSS = require('gulp-clean-css'),
	server = require('gulp-server-livereload'),
	watch = require('gulp-watch'),
	file = require('gulp-file'),
	insert = require('gulp-insert'),
	jade = require('gulp-jade'),
	prettify = require('gulp-html-prettify');

var dir = path.resolve(__dirname) + path.sep,
	dist = dir + 'dist' + path.sep,
	src = dir + 'source' + path.sep,
	css_folder = src + 'css',
	jade_folder = src + 'jade',
	js_folder = src + 'js',
	images_folder = src + 'images',
	fonts_folder = src + 'fonts';


var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions','> 1%','ie >= 10'] });

function log(error) {
	console.log([
		'',
		"----------ERROR MESSAGE START----------",
		("[" + error.name + " in " + error.plugin + "]"),
		error.message,
		"----------ERROR MESSAGE END----------",
		''
	].join('\n'));
	this.end();
}


gulp.task('clear', function() {
	return del( [dist + '**/*'] );
});


gulp.task('css', function(){
	console.log('_______css______');
	return gulp.src([css_folder + path.sep + 'style.less'])
			.pipe( sourcemaps.init() )
			.pipe( less({ plugins: [autoprefix] }).on('error', function(err){
				console.log(err);
				this.emit('end');
			}) )
			.pipe( sourcemaps.write('/') )
			.pipe( cleanCSS({compatibility: '*'}) )
			.pipe( gulp.dest( dist+'css' ) );
});

gulp.task('jade',function(){
	console.log('_______jade______');
	return gulp.src( jade_folder + '/index.jade' )
			.pipe(jade({pretty: true})).on('error', log)
			.pipe(prettify({indent_char: '	', indent_size: 1}))
			.pipe(gulp.dest( dist ));
});

gulp.task('js', function(){
	console.log('_______js______');
	return 	gulp.src(js_folder + '/**/*')
			.pipe( gulp.dest( dist+'js' ) );
});

gulp.task('fonts', function(){
	console.log('_______fonts______');
	return 	gulp.src(fonts_folder + '/**/*')
			.pipe( gulp.dest( dist+'fonts' ) );
});

gulp.task('images', function(){
	console.log('_______images______');
	return 	gulp.src(images_folder + '/**/*')
			.pipe( gulp.dest( dist+'images' ) );
});

gulp.task('server',function(){
	return 	gulp.src( path.resolve(__dirname) )
			.pipe( server({ livereload: true, open: false, directoryListing: true }) );
});

gulp.task('build', ['clear'], function(){
	gulp.start('images');
	gulp.start('js');
	gulp.start('jade');
	gulp.start('fonts');
	gulp.start('css');
});

gulp.task('default', ['build','server'], function(){
	watch( images_folder + '/**/*', function(){
		gulp.start('images');
	});
	watch( js_folder + '/**/*', function(){
		gulp.start('js');
	});			
	watch( jade_folder + '/**/*.jade', function(){
		gulp.start('jade');
	});			
	watch( fonts_folder + '/**/*', function(){
		gulp.start('fonts');
	});			
	watch( css_folder + '/**/*', function(){
		gulp.start('css');
	});					
});



/* bem help task */

function addItem(item){
	file(item.file, item.rule )
	.pipe(gulp.dest(item.folder));

	gulp.src(item.parent)
	.pipe(insert.append(item.import))
	.pipe(gulp.dest(item.parent_path));
}

function rmItem(item){
	del( [item.folder] );

	gulp.src(item.parent)
	.pipe(insert.transform(function(contents, file){
		contents = contents.replace( item.import, '' );
		return contents;
	}))
	.pipe(gulp.dest(item.parent_path));
}

function initItem(item){
	item.file = `${getItemFile(item)}.less`;
	item.folder = `${getItemFolder(item)}`;
	item.rule = `.${getItemFile(item)}\{\r\n\r\n\}\r\n\r\n`;
	item.import = `@import '${item.sep}${item.name}/${item.file}';\r\n`;
	item.parent_path = `${getItemParentPath(item)}`;
	item.parent = `${getItemParentPath(item)}/${item.prev.file}`;
	return item;
}

function getItemFile(item){
	if( !item.prev ){
		return '';
	}else{
		return `${getItemFile(item.prev)}${item.sep}${item.name}`;
	}
}

function getItemFolder(item){
	if( !item.prev ){
		return `${item.folder}/${item.name}`;
	}else{
		return `${getItemFolder(item.prev)}/${item.sep}${item.name}`;
	}
}

function getItemParentPath(item){
	if( !item.prev ){
		return item.folder;
	}else{
		return `${getItemParentPath(item.prev)}/${item.prev.sep}${item.prev.name}`;
	}
}

function actItem(item,action){
	if(action === '--add'){
		addItem( item );	
	}else if(action === '--rm'){
		rmItem( item );
	}		
}

gulp.task('hlp', function() {
	var action = process.argv[3];
	var type = process.argv[4];
	var selector = process.argv[5];
	var base = {
		sep: '',
		prev: false,
		name: 'blocks',//base folder
		file: 'blocks.less', //base filename
		folder: css_folder,
	};	
	var block = {
		sep: '',
		prev: base,
	};
	var elem = {
		sep: '__',
		prev: block,
	};
	var mod = {
		sep: '--',
		prev: undefined,
	};

	block.name = selector.split('__')[0].split('--')[0];
	block = initItem(block);

	switch( type ){
		case '-b':
			actItem(block,action);		
		break;
		case '-e':
			elem.name = selector.split('__')[1].split('--')[0];
			elem = initItem(elem);
			actItem(elem,action);				
		break;
		case '-m':
			if( selector.indexOf('__') !== -1 ){
				mod.prev = elem;
				elem.name = selector.split('__')[1].split('--')[0];
				elem = initItem(elem);
				mod.name = selector.split('--')[1];
				mod = initItem(mod);
				actItem(mod,action);					
			}else{
				mod.prev = block;
				mod.name = selector.split('--')[1];
				mod = initItem(mod);
				actItem(mod,action);					
			}
		break;
	}
});

