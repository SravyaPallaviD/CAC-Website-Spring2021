
//Homepage statistics count up animation:
const counters = document.querySelectorAll('.counter');
const speed = 500; // The lower the faster

counters.forEach(counter => {
    const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        
        const inc = target / speed;


        // Check if target is reached
        if (count < target) {
            // Add inc to count and output in counter
            counter.innerText = count + Math.trunc(inc);
            // Call function every ms
            setTimeout(updateCount, 1);
        } else {
            counter.innerText = target;
        }
    };

    updateCount();
});

//include header and footer to every page
var fileinclude = require('gulp-file-include'),
  gulp = require('gulp');

gulp.task('fileinclude', function() {
  gulp.src(['index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./'));
});
