(function(win) {
  
  // Also prefix for localStorage items
  // Each course has ites own item, that way you can easily share a course.
  var storageName = "courser";
  var storageCoursePrefix = "courser_course_";
  
  var _saveCourse = function(course) {
    win.localStorage.setItem(course.filename, JSON.stringify(course));
  };
  
  var _deleteCourse = function(id) {
    var courses = _getCourses();
    var course = courses[id];
    win.localStorage.removeItem(course.filename);
  };
  
  var _getCourse = function(id) {
    var courses = _getCourses();
    return courses[id];
  };
  
  var getStorageItem = function(key) {
    var item = win.localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  };
  
  var _getCourses = function() {
    var courses = {};
    Object.keys(localStorage).forEach(function(key) {
      if (key.startsWith(storageCoursePrefix)) {
        var course = getStorageItem(key);
        courses[course.id] = course;
      }
    });
    return courses;
  };

  win.Storage = {
    
    storageCoursePrefix : storageCoursePrefix,
    
    ready : function() {
      var me = this;
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve();
        }, 400);
      });
    },
  
    _getCourses : _getCourses,
  
    getCourses : function() {
      var courses = _getCourses();
      Object.keys(courses).forEach(function(courseId) {
        var course = courses[courseId];
        var courseEntries = course.entries;
        course.count = Object.keys(courseEntries).length;
        course.count_attempt_success = 0;
        course.count_attempt_failure = 0;
        Object.keys(courseEntries).forEach(function(entryId) {
          if (courseEntries[entryId].attempt_success) {
            course.count_attempt_success += 1;
          }
          if (courseEntries[entryId].attempt_failure) {
            course.count_attempt_failure += 1;
          }
        });
      }, this);
      
      return Promise.resolve(courses);
    },
    
    saveCourse : function(course) {
      if (!course.id) {
        course.id = Date.now();
        course.entries = {};
        course.count_attempt_failure = 0;
        course.count_attempt_success = 0;
      }
      if (!course.filename) {
        course.filename = storageCoursePrefix + course.id;
      }
      course.count = course.count || 0;
      _saveCourse(course);
      return Promise.resolve(course);
    },

    deleteCourse : function(id) {
      _deleteCourse(id);
      return Promise.resolve();
    },
    
    resetCourse : function(courseId) {
      var course = _getCourse(courseId);
      var entries = course.entries;
      Object.keys(entries).forEach(function(entryId) {
        var entry = entries[entryId];
        entry.attempt_success = 0;
        entry.attempt_failure = 0;
      });
      _saveCourse(course);
      return Promise.resolve(course);
    },

    getEntries : function(courseId, onlyNonSuccess) {
      var course = _getCourse(courseId);
      var entries = course.entries;
      if (onlyNonSuccess) {
        Object.keys(entries).forEach(function(id) {
          if (entries[id].attempt_success) {
            delete entries[id];
          }
        });
      }
      return Promise.resolve(entries);
    },

    saveEntry : function(entry, courseId, options) {
      options = options || {};
      var realCourseId = entry.course_id
          ? parseInt(entry.course_id) : parseInt(courseId);
      var course = _getCourse(realCourseId);
      if (options.hasLocalChange) {
        course.hasLocalChange = true;
      }
      if (!entry.id) {
        entry.id = Object.keys(course.entries).length
          ? Math.max.apply(null, Object.keys(course.entries)) + 1 : 1;
      }
      entry.course_id = realCourseId;
      course.entries[entry.id] = entry;
      _saveCourse(course);
      return Promise.resolve({
        course : course,
        entry : entry
      });
    },

    deleteEntry : function(entryId, courseId) {
      var course = _getCourse(courseId);
      delete course.entries[entryId];
      _saveCourse(course);
      return Promise.resolve(course);
    }
    
  };

}(window));
