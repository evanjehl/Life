var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//cell dimensions and border properties
var cellStyle = {
  width: '10px',
  height: '10px',
  border: '1px solid rgba(104, 112, 103, 0.5)'
};

//cell color of 'alive' state in first generation
var aliveStyle = {
  backgroundColor: 'pink'
};

//cell color of 'dead' state
var deadStyle = {
  backgroundColor: 'black'
};

//cell color of 'alive' state for more than one generation
var oldStyle = {
  backgroundColor: 'red'
};

//top navigation bar properties
var navStyle = {
  width: '100%',
  position: 'fixed',
  marginTop: '-100px',
  height: '30px',
  backgroundColor: 'black',
  color: 'rgb(104, 112, 103)',
  zIndex: 1
};

//navigation bar generation counter properties
var genStyle = {
  position: 'absolute',
  marginLeft: '20px'
};

//navigation bar play/pause button properties
var ppStyle = {
  position: 'absolute',
  marginLeft: '200px',
  cursor: 'pointer'
};

//navigation bar clear button properties
var clearStyle = {
  position: 'absolute',
  marginLeft: '300px',
  cursor: 'pointer'
};

//table position and margin
var tableStyle = {
  position: 'relative',
  margin: '0 auto',
  marginTop: '100px'
};

var rowInputStyle = {
  position: 'relative',
  marginLeft: '500px'
};

var colInputStyle = {
  position: 'relative',
  marginLeft: '700px',
  marginTop: '-28px'
};

var inputStyle = {
  backgroundColor: 'transparent',
  width: '50px',
  border: '1px solid black'

  //three possible states for each cell
};var lifecycle = [aliveStyle, deadStyle, oldStyle];

//component for game board

var Board = function (_React$Component) {
  _inherits(Board, _React$Component);

  function Board(props) {
    _classCallCheck(this, Board);

    var _this = _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).call(this, props));

    //generates random board with each cell in one of three possible states; called automatically upon mounting
    _this.generateRandomBoard = function () {
      var board = [];
      var rows = 150;
      var cols = 120;
      for (var i = 0; i < rows; i++) {
        board.push([]);
        for (var j = 0; j < cols; j++) {
          board[i][j] = Math.round(Math.random());
        }
      }
      return board;
    };

    //advances board one generation; contains logic for state of cells in next generation
    _this.tick = function () {
      var arr = [];
      for (var i = 0; i < _this.state.rows; i++) {
        var row = _this.state.board[i].slice();
        for (var j = 0; j < _this.state.cols; j++) {
          row[j] = _this.checkSurroundingCells(i, j);
        }
        arr.push(row);
      }
      _this.setState({
        board: arr,
        generation: ++_this.state.generation
      });
    };

    //checks cells contiguous to a particular cell with x and y coordinates given by parameters i,j, respectively
    _this.checkSurroundingCells = function (i, j) {
      var x = i + 1 >= _this.state.rows ? 0 : i + 1;
      var y = i - 1 <= -1 ? _this.state.rows - 1 : i - 1;
      var z = j + 1 >= _this.state.cols ? 0 : j + 1;
      var w = j - 1 <= -1 ? _this.state.cols - 1 : j - 1;
      var arr = [[y, w], [y, j], [y, z], [i, w], [i, z], [x, w], [x, j], [x, z]];
      var liveNeighbors = 0;
      for (var k = 0; k < arr.length; k++) {
        if (_this.state.board[arr[k][0]][arr[k][1]] !== 1) {
          liveNeighbors++;
        }
      }
      switch (liveNeighbors) {
        case 2:
          if (_this.state.board[i][j] === 1) return 1;
        case 3:
          if (_this.state.board[i][j] === 1) return 0;
          return 2;
        default:
          return 1;
      }
    };

    //toggles cell state to dead if alive or old and alive if dead when user clicks cell
    _this.handleClick = function (row, col) {
      var clickedRow = _this.state.board[row].slice();
      clickedRow[col] = _this.state.board[row][col] !== 1 ? 1 : 0;
      var arr = [];
      for (var i = 0; i < _this.state.rows; i++) {
        var nextRow = i === row ? clickedRow : _this.state.board[i].slice();
        arr.push(nextRow);
      }
      _this.setState({
        board: arr
      });
    };

    //toggles board state between 'play' - board ticking up generations - and 'pause' - board displaying single generation
    _this.togglePlayPause = function () {
      var that = _this;
      _this.setState({
        play: !_this.state.play,
        ticker: _this.state.play ? clearInterval(_this.state.ticker) : setInterval(function () {
          that.tick();
        }, _this.state.speed)
      });
    };

    //sets all cells on board to 'dead'
    _this.clear = function () {
      var arr = [];
      for (var i = 0; i < _this.state.rows; i++) {
        arr.push([]);
        for (var j = 0; j < _this.state.cols; j++) {
          arr[i][j] = 1;
        }
      }
      _this.setState({
        play: false,
        ticker: clearTimeout(_this.state.ticker),
        board: arr,
        generation: 0
      });
    };

    _this.state = {
      board: _this.generateRandomBoard(),
      ticker: null,
      generation: 0,
      play: false,
      rows: 150,
      cols: 120,
      speed: 50
    };
    return _this;
  }




  _createClass(Board, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var that = this;
      this.setState({
        ticker: setInterval(function () {
          that.tick();
        }, this.state.speed),
        play: true
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var that = this;
      var board = this.state.board.map(function (a, row) {
        return React.createElement(
          'tr',
          null,
          a.map(function (b, col) {
            var style = _extends({}, cellStyle, lifecycle[b]);
            var animate = function animate() {
              return that.handleClick(row, col);
            };
            return React.createElement('td', { onClick: animate, style: style });
          })
        );
      });
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { style: navStyle },
          React.createElement(
            'div',
            { style: genStyle },
            'Generation: ',
            this.state.generation
          ),
          React.createElement(
            'div',
            { style: ppStyle, onClick: this.togglePlayPause },
            this.state.play ? '❚❚' : '▶'
          ),
          React.createElement(
            'div',
            { style: clearStyle, onClick: this.clear },
            'Clear'
          )
        ),
        React.createElement(
          'table',
          { style: tableStyle },
          board
        )
      );
    }
  }]);

  return Board;
}(React.Component);

ReactDOM.render(React.createElement(Board, null), document.getElementById('node'));
