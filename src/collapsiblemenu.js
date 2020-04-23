import React from 'react';
import ReactDOM from 'react-dom';

export default class CollapsibleMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isCollapse: false,
            title: this.props.title
        };
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(){
        this.setState(state => ({
            isCollapse: !state.isCollapse
        }));
    }

    render(){
        let output;
        if (this.state.isCollapse){
            output = null;
        } else {
            output =this.props.children;
        }
        return(
            <div>
                <button type="button" onClick={this.handleClick}>
                    {this.state.title}
                </button>
                    {output}
            </div>
        );
    }
}
