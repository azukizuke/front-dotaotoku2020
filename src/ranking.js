import React from 'react';
import ReactDOM from 'react-dom';
import * as images from './image'

export default class RankingTable extends React.Component {
    constructor(props) {
        super(props);
        this.make_ranking_render = this.make_ranking_render.bind(this);
    }

    make_ranking_render(key, mode){
        return(
            <div class="pickban_ranking_items">
                <Ranking 
                    ranking={this.props.leaguejson['pickbans'][key]}
                    herojson={this.props.leaguejson['heroes']}
                    match_num={this.props.leaguejson['match_num']}
                    mode={mode}
                    rank = {10}
                />
            </div>
        );
    }

    render(){
        let sort_pickbanjson = {};
        let testdict={};
        return(
            <div>
                test ranking table Component
                <div class="pickban_ranking">
                    {this.make_ranking_render("all", "pos1")}
                    {this.make_ranking_render("all", "pos2")}
                    {this.make_ranking_render("all", "pos3")}
                    {this.make_ranking_render("all", "pos4")}
                    {this.make_ranking_render("all", "pos5")}
                </div>
            </div>
        );
    }
}

class Ranking extends React.Component {
    constructor(props){
        super(props)
        this.makeRankingOutput = this.makeRankingOutput.bind(this);
        this.is_filter_role = this.is_filter_role.bind(this);
        this.makeStats = this.makeStats.bind(this);
    }

    is_filter_role(heroid){
        return (this.props.herojson[heroid]['hero_role'][this.props.mode]);
    }

    makeSortKeys(ranking){
        var sorted_keys = [];
        for (var key in ranking){
            sorted_keys.push(key);
        }
        sorted_keys.sort((a,b) => ranking[b] - ranking[a]);
        return sorted_keys;
    }

    makeHeroImage(heroid){
        console.log(this.props.herojson[heroid]['imagefile'])
        return(
            <img
                src={images.default[this.props.herojson[heroid]['imagefile']]}
                class="image_hero"
            />
        );
    }

    makeStats(heroid){
        let percent_all = this.props.herojson[heroid]['pickbans']['all'] * 100 / this.props.match_num;
        let percent_pick = this.props.herojson[heroid]['pickbans']['pick'] * 100 / this.props.match_num;
        let percent_ban = this.props.herojson[heroid]['pickbans']['ban'] * 100 / this.props.match_num;

        return(
            <div>
                <ul>
                    <li>all : {percent_all}%</li>
                    <li>pick : {percent_pick}%</li>
                    <li>ban : {percent_ban}%</li>
                </ul>
            </div>
        );
    }

    makeRankingOutput(filter){
        const row = [];
        var sorted_keys = this.makeSortKeys(this.props.ranking);
        let counter = 1
        for (var key in sorted_keys){
            let heroid = sorted_keys[key]
            // posistion filter
            if (this.is_filter_role(heroid)){
                row.push(
                    <tr>
                        <td>{this.makeHeroImage(heroid)}</td>
                        <td>{this.makeStats(heroid)}</td>
                    </tr>
                );
                counter += 1
                if (counter === this.props.rank) break;
            }
        }

        return(row);
    }

    render(){
        let ranking_row = [];
        ranking_row = this.makeRankingOutput(this.props.mode);
        return(
            <div>
                {this.props.mode}
                <table>
                    <tr>
                        <th>heroid</th>
                        <th>stat</th>
                    </tr>
                    {ranking_row}
                </table>
            </div>
        );
    }
}
