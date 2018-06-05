import React, { Component } from 'react';

class Views extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: props.login,
            user_view: props.userviews,
            views: props.views
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (props.login === state.isLogin && props.user_view === state.user_view && props.views === state.views)
            return null;
        return {
            user_view: props.userviews,
            views: props.views,
            isLogin: props.login
        }
    }

    render() {
        return (
            <div>
                {this.state.isLogin === true && <div> User views: {this.state.user_view}</div>}
                All views: {this.state.views}
            </div>
        );
    }

}

export default Views;