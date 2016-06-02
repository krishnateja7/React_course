(function(win) {

  win.CourseActionScreen = React.createClass({
    onEntriesClick : function() {
      this.props.store.dispatch({
        type : "REQUEST_SELECT_ENTRIES",
        value : this.props.course.id
      });
    },
    onDoClick : function() {
      
      var disableTestInfo = [];
      if (this.props.course.count <= 4) {
        disableTestInfo.push("- create at least 5 entries");
      }
      if (win.Constants.testTypes.filter(function(testType) {
        return this.props.course[testType] === true;
      }, this).length == 0) {
        disableTestInfo.push("- choose at least 1 test type in Edit course screen");
      }
      if (disableTestInfo.length) {
        alert("Please make sure to:\n\n" + disableTestInfo.join("\n"));
        return;
      }
      
      this.props.store.dispatch({
        type : "REQUEST_DO_COURSE",
        value : this.props.course.id
      });
    },
    onShuffleClick : function() {
      this.props.store.dispatch({
        type : "REQUEST_DO_SHUFFLE",
        value : this.props.course.id
      });
    },
    onEditClick : function() {
      this.props.store.dispatch({
        type : "SELECT_COURSE_EDIT",
        value : this.props.course.id
      });
    },
    onMore : function() {
      this.props.store.dispatch({
        type : "SHOW_COURSEACTION_MENU",
        value : !this.props.courseActionMenuShow
      });
    },
    onDelete : function() {
      if (this.props.course.dropbox_id && (!this.props.dropboxAccount || !navigator.onLine)) {
        if (!confirm("This course is connected to your Dropbox account, but you are currently not connected to Dropbox or you are offline. If you delete this course, it will only be deleted on this device. Continue?")) {
          return;
        }
      }
      if (!confirm("Delete course '" + this.props.course.title + "' with " + this.props.course.count + " entries?")) {
        return;
      }
      this.props.store.dispatch({
        type : "REQUEST_DELETE_COURSE"
      });
    },
    onShare : function() {
      if (!navigator.onLine || !this.props.dropboxAccount) {
        return;
      }
      this.props.store.dispatch({
        type : "REQUEST_SHARE_COURSE"
      });
    },
    render : function() {
      var disableTestInfo = [];
      if (this.props.course.count <= 4) {
        disableTestInfo.push("Create at least 5 entries");
      }
      if (win.Constants.testTypes.filter(function(testType) {
        return this.props.course[testType] === true;
      }, this).length == 0) {
        disableTestInfo.push("Choose at least 1 test type");
      }
      var disabledClass = navigator.onLine && this.props.dropboxAccount ? "" : "disabledLink";
      var shareMenuItem = "";
      if (this.props.course.dropbox_id) {
        if (this.props.sharedLink) {
          shareMenuItem = (<li><input type="text" defaultValue={this.props.sharedLink} /></li>);
        } else {
          shareMenuItem = (<li><a className={disabledClass} onClick={navigator.onLine ? this.onShare : win.noop}>Get shared link</a></li>);
        }
        
      }
      return (
        <div id="screen">
          <div id="navbar">
            <div className="navbarButtonContainer" id="navbarLeft">
              <button className="fullwidthButton" onClick={this.props.onBack}>&lt;</button>
            </div>
            <div id="navbarTitle">{this.props.course.title}</div>
            <div className="navbarButtonContainer" id="navbarRight">
              <button onClick={this.onMore}>=</button>
            </div>
          </div>
          <div id="main">
            <div className="row">
              <button className="normalButton fullwidthButton" onClick={this.onEntriesClick}>Entries ({this.props.course.count})</button>
            </div>
            <div className="row">
              <button
                className="normalButton fullwidthButton"
                disabled={this.props.course.count == 0}
                onClick={this.onShuffleClick}>Shuffle</button>
            </div>
            <div className="row">
              <button
                className="normalButton fullwidthButton"
                onClick={this.onDoClick}>Test</button>
            </div>
          </div>
          {this.props.courseActionMenuShow
            ? (
              <ul id="popup" className="listView">
                <li><a onClick={this.onEditClick}>Edit</a></li>
                {shareMenuItem}
                <li><a className="deleteLink" onClick={this.onDelete}>Delete</a></li>
              </ul>
            ) : ""}
        </div>
      );
    }
  });

}(window));