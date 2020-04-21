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
                    ranking={this.props.pickbanjson[key]}
                    mode={mode}
                    herojson={this.props.herojson}
                    rank = {10}
                />
            </div>
        );
    }

    render(){
        const pickbanjson = this.props.pickbanjson;
        const herojson = this.props.herojson;
        let sort_pickbanjson = {};
        let testdict={};
        return(
            <div>
                <h2>test ranking table Component</h2>
                メモ:各pos indexjson + python上でのランク整備
                <br />この下のゴミ関数化しよう
                <br />あとpropsわたして表示数変わるようにする ヘッダも
                <br />画像はheroidと画像タグのひっつけるindexjsonと関数つくる
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

    makeRankingOutput(filter){
        const row = [];
        var sorted_keys = this.makeSortKeys(this.props.ranking);
        // posostion filter
        let counter = 1
        for (var key in sorted_keys){
            let heroid = sorted_keys[key]
            if (this.is_filter_role(heroid)){
                row.push(
                    <tr>
                        <td>{this.makeHeroImage(heroid)}</td>
                        <td>{this.props.ranking[heroid]}</td>
                    </tr>
                );
                counter += 1
                if (counter === this.props.rank) break;
            }
        }

        return(row);
    }

    render(){
        const ranking = this.props.ranking;
        let ranking_row = [];
        ranking_row = this.makeRankingOutput(this.props.mode);
        return(
            <div>
                <h3>{this.props.mode}</h3>
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
