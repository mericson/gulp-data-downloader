var through = require("through2");
var gutil = require("gulp-util");
var request = require("request");

module.exports = function(files){

	var files = typeof files === "string" ? [files] : files;

	var stream = through.obj(function(file,enc,callback){
		this.push(file);
		callback();
	});

	var downloaded = 0;

	files.forEach(function(file){

		var url;
		var fileName; 

		if ( typeof file == 'object' ) {
      url = file.url;
      if ( file.path ) {
        fileName = file.path
      } else {
        fileName = file.url.split("/").pop();
      }
    } else {

      url = file;
      fileName = file.split("/").pop();
    }

    gutil.log( 'Downloading ' + gutil.colors.cyan(url)+' to ', gutil.colors.magenta(fileName));

		request(url,function(err,res,body){
			if(err){
				gutil.log(gutil.colors.red('Error'), 'in Plugin', '\''+gutil.colors.cyan('gulp-download')+'\'', ': Failed downloading file', gutil.colors.magenta(url), 'skipping download');
			}else{
				stream.write(new gutil.File({
					path: fileName,
					contents: new Buffer(body)
				}));
			}

			downloaded++;

			if(downloaded === files.length) stream.end();
		});
	});

	return stream;
}