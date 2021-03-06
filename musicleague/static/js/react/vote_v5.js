"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VoteControl = function (_React$Component) {
    _inherits(VoteControl, _React$Component);

    function VoteControl(props) {
        _classCallCheck(this, VoteControl);

        var _this = _possibleConstructorReturn(this, (VoteControl.__proto__ || Object.getPrototypeOf(VoteControl)).call(this, props));

        _this.state = {
            uri: props.uri,
            points: props.previousVote
        };
        return _this;
    }

    _createClass(VoteControl, [{
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            this.adjustProgress();
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            window.addEventListener("resize", this.adjustProgress.bind(this));
            setTimeout(this.adjustProgress.bind(this), 500);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            window.removeEventListener("resize", this.adjustProgress.bind(this));
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var stateClass = this.state.points < 0 ? "downVoted" : this.state.points > 0 ? "upVoted" : "";
            return React.createElement(
                "div",
                { className: "col-xs-6 col-sm-4 col-md-4 col-height col-middle", style: { padding: '0' } },
                React.createElement(
                    "div",
                    { className: "row-height" },
                    React.createElement(
                        "div",
                        { className: "progressWrapper col-height col-middle", ref: function ref(div) {
                                _this2.progressWrapper = div;
                            } },
                        React.createElement(
                            "div",
                            { className: "row-height" },
                            React.createElement(
                                "div",
                                { className: "progressWrapperInner col-height col-middle", ref: function ref(div) {
                                        _this2.progressWrapperInner = div;
                                    } },
                                React.createElement(
                                    "div",
                                    { className: "row-height" },
                                    React.createElement(
                                        "div",
                                        { className: "hidden-xs voteControl col-height col-middle" + " " + stateClass },
                                        React.createElement(
                                            "div",
                                            { className: "voteControlInner" },
                                            React.createElement("span", { className: this.downVoteAllowed() ? "downButton" : "downButton disabled", onClick: this.downVote.bind(this) }),
                                            React.createElement(
                                                "span",
                                                { className: "pointCount" },
                                                this.padValue(this.state.points)
                                            ),
                                            React.createElement("span", { className: this.upVoteAllowed() ? "upButton" : "upButton disabled", onClick: this.upVote.bind(this) }),
                                            React.createElement("span", { className: "statusIcon" })
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "visible-xs voteControl col-height col-top" + " " + stateClass },
                                        React.createElement(
                                            "div",
                                            { className: "voteControlInner" },
                                            React.createElement("span", { className: this.downVoteAllowed() ? "downButton" : "downButton disabled", onClick: this.downVote.bind(this) }),
                                            React.createElement(
                                                "span",
                                                { className: "pointCount" },
                                                this.padValue(this.state.points)
                                            ),
                                            React.createElement("span", { className: this.upVoteAllowed() ? "upButton" : "upButton disabled", onClick: this.upVote.bind(this) })
                                        ),
                                        React.createElement("span", { className: "statusIcon" })
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }, {
        key: "padValue",
        value: function padValue(val) {
            return Math.abs(val) > 9 ? "" + Math.abs(val) : "0" + Math.abs(val);
        }
    }, {
        key: "downVoteAllowed",
        value: function downVoteAllowed() {
            return !this.props.maxDownVotes || this.state.points > this.props.maxDownVotes * -1;
        }
    }, {
        key: "downVote",
        value: function downVote() {
            var newPointValue = this.state.points - 1;
            if (!this.props.maxDownVotes || newPointValue >= 0 || Math.abs(newPointValue) <= this.props.maxDownVotes) {
                var downVoteAllowed = this.props.onDownVote(this.state.uri, newPointValue);
                if (downVoteAllowed) {
                    this.setState({ points: newPointValue });
                }
            } else {
                console.log("Down vote count " + Math.abs(newPointValue) + " exceeds per-song allowance of " + this.props.maxDownVotes + ". Rejecting.");
            }
        }
    }, {
        key: "upVoteAllowed",
        value: function upVoteAllowed() {
            return !this.props.maxUpVotes || this.state.points < this.props.maxUpVotes;
        }
    }, {
        key: "upVote",
        value: function upVote() {
            var newPointValue = this.state.points + 1;
            if (!this.props.maxUpVotes || newPointValue <= 0 || newPointValue <= this.props.maxUpVotes) {
                var upVoteAllowed = this.props.onUpVote(this.state.uri, newPointValue);
                if (upVoteAllowed) {
                    this.setState({ points: newPointValue });
                }
            } else {
                console.log("Up vote count " + newPointValue + " exceeds per-song allowance of " + this.props.maxUpVotes + ". Rejecting.");
            }
        }
    }, {
        key: "adjustProgress",
        value: function adjustProgress() {
            var newPointValue = this.state.points;

            if (this.progressWrapper == null) return;

            var height = this.progressWrapper.offsetHeight;
            var edgeHeight = height - 5;
            var width = this.progressWrapper.offsetWidth;
            var edgeWidth = width - 5;

            if (newPointValue >= 0 && !this.props.maxUpVotes) {
                var progress = 0;
                var progressColor = "#FFFFFF";
            } else if (newPointValue < 0 && !this.props.maxDownVotes) {
                var progress = 0;
                var progressColor = "#FFFFFF";
            } else if (newPointValue >= 0) {
                var progress = newPointValue / this.props.maxUpVotes;
                var progressColor = "#5FCC34";
            } else {
                var progress = Math.abs(newPointValue) / this.props.maxDownVotes;
                var progressColor = "#D21E35";
            }

            var totalLength = width * 2 + height * 2;
            var borderLen = progress * totalLength;

            var oneSide = width - 8;
            var twoSides = oneSide + (height + 8);
            var threeSides = twoSides + (width + 8);
            var fourSides = threeSides + (height - 8);

            if (borderLen == 0) {
                var top = width * -1 + 'px 0px';
                var right = ', ' + edgeWidth + 'px ' + height * -1 + 'px';
                var bottom = ', ' + width + 'px ' + edgeHeight + 'px';
                var left = ', 0px ' + height + 'px';
                var borderRad = "border-radius: 0; ";
                var backgroundSize = 'background-size: 0, 0, 0, 0; ';
                this.progressWrapperInner.removeAttribute('style');
            }
            // If progress can be expressed on top border alone
            else if (borderLen <= oneSide) {
                    var top = '6px 0px';
                    var right = ', ' + edgeWidth + 'px ' + height * -1 + 'px';
                    var bottom = ', ' + width + 'px ' + edgeHeight + 'px';
                    var left = ', 0px ' + height + 'px';
                    var borderRad = "border-radius: 0 8px 8px 8px; ";
                    var backgroundSize = 'background-size: ' + borderLen + 'px 5px, 0px 0px, 0px 0px, 0px 0px; ';

                    if (borderLen == oneSide) this.progressWrapperInner.setAttribute('style', 'border-top-left-radius: 0; border-top-right-radius: 0');else this.progressWrapperInner.setAttribute('style', 'border-top-left-radius: 0');
                }
                // If progress can be expressed on top and right borders alone
                else if (borderLen <= twoSides) {
                        var top = '6px 0px';
                        var right = ', ' + edgeWidth + 'px ' + (height * -1 + (borderLen - width)) + 'px';
                        var bottom = ', ' + width + 'px ' + edgeHeight + 'px';
                        var left = ', 0px ' + height + 'px';
                        var borderRad = "border-radius: 0 8px 8px 8px; ";
                        var backgroundSize = 'background-size: 100% 5px, 5px ' + edgeHeight + 'px, 0px 0px, 0px 0px; ';

                        if (borderLen == twoSides) this.progressWrapperInner.setAttribute('style', 'border-top-left-radius: 0; border-bottom-right-radius: 0');else this.progressWrapperInner.setAttribute('style', 'border-top-left-radius: 0');
                    }
                    // If progress can be expressed on top, right, and bottom borders alone
                    else if (borderLen <= threeSides) {
                            var top = '6px 0px';
                            var right = ', ' + edgeWidth + 'px 0px';
                            var bottom = ', ' + (width - (borderLen - width - height)) + 'px ' + edgeHeight + 'px';
                            var left = ', 0px ' + height + 'px';
                            var borderRad = "border-radius: 0 8px 8px 8px; ";
                            var backgroundSize = 'background-size: 100% 5px, 5px 100%, ' + edgeWidth + 'px 5px, 0px 0px; ';

                            if (borderLen == threeSides) this.progressWrapperInner.setAttribute('style', 'border-top-left-radius: 0; border-bottom-left-radius: 0');else this.progressWrapperInner.setAttribute('style', 'border-top-left-radius: 0');
                        }
                        // If progress needs all four borders to be expressed
                        else if (borderLen < fourSides) {
                                var top = '6px 0px';
                                var right = ', ' + edgeWidth + 'px 0px';
                                var bottom = ', 0px ' + edgeHeight + 'px';
                                var left = ', 0px ' + (height - (borderLen - width * 2 - height)) + 'px';
                                var borderRad = "border-radius: 8px 8px 8px 8px; ";
                                var backgroundSize = 'background-size: 100% 5px, 5px 100%, 100% 5px, 5px 100%; ';

                                if (borderLen == fourSides) this.progressWrapperInner.removeAttribute('style');else this.progressWrapperInner.setAttribute('style', 'border-top-left-radius: 0');
                            }

                            // If progress is equal to the whole length of the border
                            else {
                                    var borderLen = fourSides;
                                    var top = '0px 0px';
                                    var right = ', ' + edgeWidth + 'px 0px';
                                    var bottom = ', 0px ' + edgeHeight + 'px';
                                    var left = ', 0px ' + (height - (borderLen - width * 2 - height)) + 'px';
                                    var borderRad = "border-radius: 8px 8px 8px 8px; ";
                                    var backgroundSize = 'background-size: 100% 5px, 5px 100%, 100% 5px, 5px 100%; ';
                                    this.progressWrapperInner.removeAttribute('style');
                                }

            var background = 'background: linear-gradient(to right, ' + progressColor + ' 99.99%, transparent), linear-gradient(to bottom, ' + progressColor + ' 99.99%, transparent), linear-gradient(to right, ' + progressColor + ' 99.99%, transparent), linear-gradient(to bottom, ' + progressColor + ' 99.99%, transparent); ';
            var backgroundRepeat = 'background-repeat: no-repeat; ';
            var backgroundPos = 'background-position: ' + top + right + bottom + left + '; ';
            this.progressWrapper.setAttribute('style', background + backgroundSize + backgroundRepeat + backgroundPos + borderRad);
        }
    }]);

    return VoteControl;
}(React.Component);

var SongInfo = function (_React$Component2) {
    _inherits(SongInfo, _React$Component2);

    function SongInfo(props) {
        _classCallCheck(this, SongInfo);

        var _this3 = _possibleConstructorReturn(this, (SongInfo.__proto__ || Object.getPrototypeOf(SongInfo)).call(this, props));

        _this3.state = {
            uri: props.uri,
            track: { name: '',
                artists: [{ name: '' }],
                album: { images: [{}, { url: '' }], name: '' },
                external_urls: { spotify: '' }
            }
        };
        return _this3;
    }

    _createClass(SongInfo, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this4 = this;

            // Get track object from Spotify API
            var trackId = this.state.uri.match(/spotify\:track\:([a-zA-Z0-9]{22})/)[1];
            var config = {
                headers: { 'Authorization': 'Bearer ' + accessToken }
            };
            axios.get('https://api.spotify.com/v1/tracks/' + trackId, config).then(function (res) {
                _this4.setState({ track: res.data });
            });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "col-xs-6 col-sm-8 col-md-8 col-height col-middle songInfo" },
                React.createElement("img", { className: "hidden-xs", src: this.state.track.album.images[1].url }),
                React.createElement("img", { className: "visible-xs", src: this.state.track.album.images[1].url }),
                React.createElement(
                    "div",
                    { className: "textInfo" },
                    React.createElement(
                        "a",
                        { className: "trackName", href: this.state.track.external_urls.spotify, target: "_blank" },
                        this.state.track.name
                    ),
                    React.createElement(
                        "span",
                        { className: "trackArtist" },
                        "By ",
                        this.state.track.artists[0].name
                    ),
                    React.createElement(
                        "span",
                        { className: "trackAlbum" },
                        this.state.track.album.name
                    )
                )
            );
        }
    }]);

    return SongInfo;
}(React.Component);

var Song = function (_React$Component3) {
    _inherits(Song, _React$Component3);

    function Song() {
        _classCallCheck(this, Song);

        return _possibleConstructorReturn(this, (Song.__proto__ || Object.getPrototypeOf(Song)).apply(this, arguments));
    }

    _createClass(Song, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "song" },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "row-height" },
                        React.createElement(SongInfo, { uri: this.props.uri }),
                        React.createElement(VoteControl, { previousVote: this.props.previousVote, maxUpVotes: this.props.maxUpVotes, maxDownVotes: this.props.maxDownVotes, uri: this.props.uri, onUpVote: this.props.onUpVote, onDownVote: this.props.onDownVote })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "comment-inp row" },
                    React.createElement(
                        "div",
                        { className: "col-xs-12 col-sm-8" },
                        React.createElement("input", { type: "text", className: "commentInput", placeholder: "Leave a comment on the song above (optional)", uri: this.props.uri, maxLength: "255", value: this.props.previousComment, onChange: this.onComment.bind(this) })
                    )
                )
            );
        }
    }, {
        key: "onComment",
        value: function onComment(e) {
            this.props.onComment(this.props.uri, e.target.value);
        }
    }]);

    return Song;
}(React.Component);

var SongListHeader = function (_React$Component4) {
    _inherits(SongListHeader, _React$Component4);

    function SongListHeader() {
        _classCallCheck(this, SongListHeader);

        return _possibleConstructorReturn(this, (SongListHeader.__proto__ || Object.getPrototypeOf(SongListHeader)).apply(this, arguments));
    }

    _createClass(SongListHeader, [{
        key: "showModal",
        value: function showModal() {
            $('#final-votes-modal').modal('show');
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "songListHeader" },
                React.createElement(
                    "div",
                    { className: "container" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "hidden-xs" },
                            React.createElement(
                                "div",
                                { className: "row-height" },
                                React.createElement(
                                    "div",
                                    { className: "hidden-xs col-sm-4 col-md-4 vcenter text-center" },
                                    React.createElement(
                                        "span",
                                        null,
                                        "Choose A Song And Add Points To Begin!"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "col-xs-6 col-sm-4 col-md-4 vcenter text-center", style: { borderLeft: "3px solid #fff" } },
                                    React.createElement(
                                        "div",
                                        { className: "progressWrapper" },
                                        React.createElement(
                                            "span",
                                            { className: "progressIndicator" },
                                            React.createElement(
                                                "span",
                                                { className: "numSpent" },
                                                this.props.upVotes > 9 ? "" + this.props.upVotes : "0" + this.props.upVotes
                                            ),
                                            " of ",
                                            React.createElement(
                                                "span",
                                                { className: "maxVotes" },
                                                this.props.maxUpVotes > 9 ? "" + this.props.maxUpVotes : "0" + this.props.maxUpVotes
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "statusIconWrapper" },
                                            React.createElement("span", { className: "statusIcon upVote" })
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: this.props.enabled ? 'col-xs-6 col-sm-4 col-md-4 vcenter text-center' : 'col-xs-6 col-sm-4 col-md-4 vcenter text-center disabled', id: "submitVotesButtonWrapper" },
                                    React.createElement(
                                        "button",
                                        { type: "button", onClick: this.showModal.bind(this), id: "submitVotesButton", className: this.props.enabled ? 'btn btn-lg' : 'btn btn-lg disabled', disabled: !this.props.enabled },
                                        "Submit",
                                        React.createElement(
                                            "span",
                                            { className: "hidden-xs" },
                                            " Votes"
                                        ),
                                        "!"
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return SongListHeader;
}(React.Component);

var SongListHeaderMobile = function (_SongListHeader) {
    _inherits(SongListHeaderMobile, _SongListHeader);

    function SongListHeaderMobile() {
        _classCallCheck(this, SongListHeaderMobile);

        return _possibleConstructorReturn(this, (SongListHeaderMobile.__proto__ || Object.getPrototypeOf(SongListHeaderMobile)).apply(this, arguments));
    }

    _createClass(SongListHeaderMobile, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "songListHeader" },
                React.createElement(
                    "div",
                    { className: "container" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "visible-xs" },
                            React.createElement(
                                "div",
                                { className: "row-height" },
                                React.createElement(
                                    "div",
                                    { className: "col-xs-6 vcenter text-center" },
                                    React.createElement(
                                        "div",
                                        { className: "progressWrapper" },
                                        React.createElement(
                                            "span",
                                            { className: "progressIndicator" },
                                            React.createElement(
                                                "span",
                                                { className: "numSpent" },
                                                this.props.upVotes > 9 ? "" + this.props.upVotes : "0" + this.props.upVotes
                                            ),
                                            " of ",
                                            React.createElement(
                                                "span",
                                                { className: "maxVotes" },
                                                this.props.maxUpVotes > 9 ? "" + this.props.maxUpVotes : "0" + this.props.maxUpVotes
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "statusIconWrapper" },
                                            React.createElement("span", { className: "statusIcon upVote" })
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: this.props.enabled ? 'col-xs-6 vcenter text-center' : 'col-xs-6 vcenter text-center disabled', id: "submitVotesButtonWrapper" },
                                    React.createElement(
                                        "button",
                                        { type: "button", onClick: this.showModal.bind(this), id: "submitVotesButton", className: this.props.enabled ? 'btn btn-lg' : 'btn btn-lg disabled', disabled: !this.props.enabled },
                                        "Submit",
                                        React.createElement(
                                            "span",
                                            { className: "hidden-xs" },
                                            " Votes"
                                        ),
                                        "!"
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return SongListHeaderMobile;
}(SongListHeader);

var SongListHeaderWithDownVotes = function (_React$Component5) {
    _inherits(SongListHeaderWithDownVotes, _React$Component5);

    function SongListHeaderWithDownVotes() {
        _classCallCheck(this, SongListHeaderWithDownVotes);

        return _possibleConstructorReturn(this, (SongListHeaderWithDownVotes.__proto__ || Object.getPrototypeOf(SongListHeaderWithDownVotes)).apply(this, arguments));
    }

    _createClass(SongListHeaderWithDownVotes, [{
        key: "showModal",
        value: function showModal() {
            $('#final-votes-modal').modal('show');
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "songListHeader" },
                React.createElement(
                    "div",
                    { className: "container" },
                    React.createElement(
                        "div",
                        { className: "hidden-xs" },
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "row-height" },
                                React.createElement(
                                    "div",
                                    { className: "col-sm-4 col-md-4 vcenter text-center" },
                                    React.createElement(
                                        "div",
                                        { className: "progressWrapper" },
                                        React.createElement(
                                            "span",
                                            { className: "progressIndicator" },
                                            React.createElement(
                                                "span",
                                                { className: "numSpent" },
                                                this.props.upVotes > 9 ? "" + this.props.upVotes : "0" + this.props.upVotes
                                            ),
                                            " of ",
                                            React.createElement(
                                                "span",
                                                { className: "maxVotes" },
                                                this.props.maxUpVotes > 9 ? "" + this.props.maxUpVotes : "0" + this.props.maxUpVotes
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "statusIconWrapper" },
                                            React.createElement("span", { className: "statusIcon upVote" })
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "col-sm-4 col-md-4 vcenter text-center", style: { borderLeft: "3px solid #fff" } },
                                    React.createElement(
                                        "div",
                                        { className: "progressWrapper" },
                                        React.createElement(
                                            "span",
                                            { className: "progressIndicator" },
                                            React.createElement(
                                                "span",
                                                { className: "numSpent" },
                                                this.props.downVotes > 9 ? "" + this.props.downVotes : "0" + this.props.downVotes
                                            ),
                                            " of ",
                                            React.createElement(
                                                "span",
                                                { className: "maxVotes" },
                                                this.props.maxDownVotes > 9 ? "" + this.props.maxDownVotes : "0" + this.props.maxDownVotes
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "statusIconWrapper" },
                                            React.createElement("span", { className: "statusIcon downVote" })
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: this.props.enabled ? 'col-sm-4 col-md-4 vcenter text-center' : 'col-sm-4 col-md-4 vcenter text-center disabled', id: "submitVotesButtonWrapper" },
                                    React.createElement(
                                        "button",
                                        { type: "button", onClick: this.showModal.bind(this), id: "submitVotesButton", className: this.props.enabled ? 'btn btn-lg' : 'btn btn-lg disabled', disabled: !this.props.enabled },
                                        "Submit",
                                        React.createElement(
                                            "span",
                                            { className: "hidden-xs" },
                                            " Votes"
                                        ),
                                        "!"
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return SongListHeaderWithDownVotes;
}(React.Component);

var SongListHeaderWithDownVotesMobile = function (_SongListHeaderWithDo) {
    _inherits(SongListHeaderWithDownVotesMobile, _SongListHeaderWithDo);

    function SongListHeaderWithDownVotesMobile() {
        _classCallCheck(this, SongListHeaderWithDownVotesMobile);

        return _possibleConstructorReturn(this, (SongListHeaderWithDownVotesMobile.__proto__ || Object.getPrototypeOf(SongListHeaderWithDownVotesMobile)).apply(this, arguments));
    }

    _createClass(SongListHeaderWithDownVotesMobile, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "songListHeader" },
                React.createElement(
                    "div",
                    { className: "container" },
                    React.createElement(
                        "div",
                        { className: "visible-xs" },
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "row-height" },
                                React.createElement(
                                    "div",
                                    { className: "col-xs-6 col-height vcenter text-center" },
                                    React.createElement(
                                        "div",
                                        { className: "progressWrapper" },
                                        React.createElement(
                                            "span",
                                            { className: "progressIndicator" },
                                            React.createElement(
                                                "span",
                                                { className: "numSpent" },
                                                this.props.upVotes > 9 ? "" + this.props.upVotes : "0" + this.props.upVotes
                                            ),
                                            " of ",
                                            React.createElement(
                                                "span",
                                                { className: "maxVotes" },
                                                this.props.maxUpVotes > 9 ? "" + this.props.maxUpVotes : "0" + this.props.maxUpVotes
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "statusIconWrapper" },
                                            React.createElement("span", { className: "statusIcon upVote" })
                                        )
                                    ),
                                    React.createElement("br", null),
                                    React.createElement(
                                        "div",
                                        { className: "progressWrapper" },
                                        React.createElement(
                                            "span",
                                            { className: "progressIndicator" },
                                            React.createElement(
                                                "span",
                                                { className: "numSpent" },
                                                this.props.downVotes > 9 ? "" + this.props.downVotes : "0" + this.props.downVotes
                                            ),
                                            " of ",
                                            React.createElement(
                                                "span",
                                                { className: "maxVotes" },
                                                this.props.maxDownVotes > 9 ? "" + this.props.maxDownVotes : "0" + this.props.maxDownVotes
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "statusIconWrapper" },
                                            React.createElement("span", { className: "statusIcon downVote" })
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: this.props.enabled ? 'col-xs-6 col-height vcenter text-center' : 'col-xs-6 col-height vcenter text-center disabled', id: "submitVotesButtonWrapper" },
                                    React.createElement(
                                        "button",
                                        { type: "button", onClick: this.showModal.bind(this), id: "submitVotesButton", className: this.props.enabled ? 'btn btn-lg' : 'btn btn-lg disabled', disabled: !this.props.enabled },
                                        "Submit",
                                        React.createElement(
                                            "span",
                                            { className: "hidden-xs" },
                                            " Votes"
                                        ),
                                        "!"
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return SongListHeaderWithDownVotesMobile;
}(SongListHeaderWithDownVotes);

var SongList = function (_React$Component6) {
    _inherits(SongList, _React$Component6);

    function SongList(props) {
        _classCallCheck(this, SongList);

        var _this10 = _possibleConstructorReturn(this, (SongList.__proto__ || Object.getPrototypeOf(SongList)).call(this, props));

        _this10.state = {
            upVotes: 0,
            downVotes: 0,
            votes: props.previousVotes,
            comments: props.previousComments
        };

        // Set number of up and down votes for previous
        for (var uri in props.previousVotes) {
            var points = props.previousVotes[uri];
            console.log('Existing vote for ' + uri + ' of ' + points);
            if (points >= 0) {
                _this10.state.upVotes += points;
            } else {
                _this10.state.downVotes += Math.abs(points);
            }
        }
        return _this10;
    }

    _createClass(SongList, [{
        key: "render",
        value: function render() {
            var listHeader = null;
            var mobileListHeader = null;
            var headerEnabled = this.state.upVotes == this.props.maxUpVotes && (!this.props.maxDownVotes || this.state.downVotes == this.props.maxDownVotes);

            if (!this.props.maxDownVotes) {
                listHeader = React.createElement(SongListHeader, { upVotes: this.state.upVotes, maxUpVotes: this.props.maxUpVotes, enabled: headerEnabled });
                mobileListHeader = React.createElement(SongListHeaderMobile, { upVotes: this.state.upVotes, maxUpVotes: this.props.maxUpVotes, enabled: headerEnabled });
            } else {
                listHeader = React.createElement(SongListHeaderWithDownVotes, { upVotes: this.state.upVotes, maxUpVotes: this.props.maxUpVotes, downVotes: this.state.downVotes, maxDownVotes: this.props.maxDownVotes, enabled: headerEnabled });
                mobileListHeader = React.createElement(SongListHeaderWithDownVotesMobile, { upVotes: this.state.upVotes, maxUpVotes: this.props.maxUpVotes, downVotes: this.state.downVotes, maxDownVotes: this.props.maxDownVotes, enabled: headerEnabled });
            }

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "form",
                    { id: "vote-form", method: "post", onSubmit: this.handleFormSubmission.bind(this) },
                    listHeader,
                    mobileListHeader,
                    React.createElement("div", { style: { padding: "15px 0" } }),
                    React.createElement(
                        "div",
                        { className: "songList" },
                        React.createElement(
                            "div",
                            { className: "container" },

                            // TODO: Pass min/max points allowed per song, null if not set
                            this.props.uris.map(function (uri) {
                                return React.createElement(
                                    "div",
                                    null,
                                    React.createElement(Song, { uri: uri, previousVote: uri in this.props.previousVotes ? this.props.previousVotes[uri] : 0, previousComment: uri in this.props.previousComments ? this.props.previousComments[uri] : '', maxUpVotes: this.props.maxUpVotesPerSong, maxDownVotes: this.props.maxDownVotesPerSong, onUpVote: this.onUpVote.bind(this), onDownVote: this.onDownVote.bind(this), onComment: this.onComment.bind(this) })
                                );
                            }.bind(this))
                        )
                    ),
                    React.createElement("input", { type: "hidden", name: "votes", id: "votes" }),
                    React.createElement("input", { type: "hidden", name: "comments", id: "comments" })
                )
            );
        }
    }, {
        key: "handleFormSubmission",
        value: function handleFormSubmission() {
            var votesJson = JSON.stringify(this.state.votes);
            document.getElementById('votes').value = votesJson;

            var commentsJson = JSON.stringify(this.state.comments);
            document.getElementById('comments').value = commentsJson;

            return true;
        }
    }, {
        key: "onComment",
        value: function onComment(uri, newCommentValue) {
            var newCommentsState = this.state.comments;
            var oldCommentValue = this.state.comments[uri];
            console.log("Song comment change recorded for '" + uri + "'. Old: '" + oldCommentValue + "', New: '" + newCommentValue + "'");
            newCommentsState[uri] = newCommentValue;
            this.setState({ comments: newCommentsState });

            return true;
        }
    }, {
        key: "onUpVote",
        value: function onUpVote(uri, newPointValue) {
            /* When a song in the SongList is upvoted, we need to determine
            whether the user is removing a downvote or adding an upvote. If
            the user is adding an upvote, we need to reject the upvote when
            it exceeds the allowance.
            */
            if (newPointValue <= 0) {
                console.log("Song vote " + newPointValue + " is still negative. Will allow.");
                var newVotesState = this.state.votes;
                newVotesState[uri] = newPointValue;
                this.setState({ downVotes: this.state.downVotes - 1, votes: newVotesState });
            } else {
                var newUpVotesValue = this.state.upVotes + 1;

                if (newUpVotesValue <= this.props.maxUpVotes) {
                    console.log("Up vote count " + newUpVotesValue + " within allowance. Will allow.");
                    var newVotesState = this.state.votes;
                    newVotesState[uri] = newPointValue;
                    this.setState({ upVotes: this.state.upVotes + 1, votes: newVotesState });
                } else {
                    console.log("Up vote count " + newUpVotesValue + " exceeds total allowance. Rejecting.");
                    return false;
                }
            }

            return true;
        }
    }, {
        key: "onDownVote",
        value: function onDownVote(uri, newPointValue) {
            /* When a song in the SongList is downvoted, we need to determine
            whether the user is removing an upvote or adding a downvote. If
            the user is adding a downvote, we need to reject the downvote When
            it exceeds the allowance.
            */
            if (newPointValue >= 0) {
                console.log("Song vote " + newPointValue + " is still positive. Will allow.");
                var newVotesState = this.state.votes;
                newVotesState[uri] = newPointValue;
                this.setState({ upVotes: this.state.upVotes - 1, votes: newVotesState });
            } else {
                var newDownVotesValue = this.state.downVotes + 1;

                if (newDownVotesValue <= this.props.maxDownVotes) {
                    console.log("Down vote count " + newDownVotesValue + " within allowance. Will allow.");
                    var newVotesState = this.state.votes;
                    newVotesState[uri] = newPointValue;
                    this.setState({ downVotes: this.state.downVotes + 1, votes: newVotesState });
                } else {
                    console.log("Down vote count " + newDownVotesValue + " exceeds total allowance. Rejecting.");
                    return false;
                }
            }

            return true;
        }
    }]);

    return SongList;
}(React.Component);

/*
NOTE: Currently rendered on template in order to inject data prior to page load
ReactDOM.render(
    <SongList
        uris={["spotify:track:429EttO8gs0bDo2SQfUNSm", "spotify:track:5Ykzu4eg5UEVJP3LCoxgpF", "spotify:track:6DXFVsLcEvOTSrkG9G1Cb1", "spotify:track:6GyFP1nfCDB8lbD2bG0Hq9", "spotify:track:0x4rW5jv6fkKweBgjE5O8F"]}
        maxDownVotes={0} maxUpVotes={10}/>,
    document.getElementById('mountVote')
);
*/