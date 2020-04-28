import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import CollapsibleMenu from './collapsiblemenu';

export default class SideNav extends React.Component {
  render() {
    const { allleaguejson, onLeagueChange } = this.props;
    return (
      <div className="sidenav">
        <p>league index</p>
        <MakeLeagueList
          allleaguejson={allleaguejson}
          onLeagueChange={onLeagueChange}
        />
      </div>
    );
  }
}

SideNav.defaultProps = {
  allleaguejson: false,
  onLeagueChange: false,
};

SideNav.propTypes = {
  allleaguejson: PropTypes.shape({
    year: PropTypes.number,
  }),
  onLeagueChange: PropTypes.func,
};

class MakeLeagueList extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.makeLeagueList = this.makeLeagueList.bind(this);
    this.makeOutputYearList = this.makeOutputYearList.bind(this);
  }

  handleClick(e) {
    const { onLeagueChange } = this.props;
    onLeagueChange(e.target.value);
  }

  makeLeagueList(year) {
    const row = [];
    const { allleaguejson } = this.props;
    const sortedLeagueIdList = [];

    //  sortList
    Object.keys(allleaguejson).map((leagueid) => {
      sortedLeagueIdList.push(leagueid);
      return true;
    });
    sortedLeagueIdList.sort(
      (a, b) => (allleaguejson[b].last_unixdate - allleaguejson[a].last_unixdate),
    );
    //  leagueList filter and push
    sortedLeagueIdList.map((leagueid) => {
      const league = allleaguejson[leagueid];
      if (league.year === year) {
        row.push(
          <button
            type="button"
            className="buttonLeague"
            value={leagueid}
            onClick={this.handleClick}
          >
            {league.name}
          </button>,
        );
      }
      return true;
    });
    return row;
  }

  makeYearList() {
    const yearlist = [];
    const { allleaguejson } = this.props;
    Object.values(allleaguejson).map((league) => {
      if (!yearlist.includes(league.year)) {
        yearlist.push(league.year);
        return true;
      }
      return false;
    });
    // sort year list
    const sortedYearlist = yearlist;
    sortedYearlist.sort((a, b) => (b - a));
    return yearlist;
  }

  makeOutputYearList() {
    const yearlist = this.makeYearList();
    const outrow = [];

    yearlist.map((year) => {
      const leagueIdRow = this.makeLeagueList(year);
      outrow.push(
        <CollapsibleMenu title={year} buttonClass="buttonYear">
          {leagueIdRow}
        </CollapsibleMenu>,
      );
      return true;
    });
    return outrow;
  }

  render() {
    const yearRow = this.makeOutputYearList();
    return (
      <div className="sideContent">
        {yearRow}
      </div>
    );
  }
}

MakeLeagueList.defaultProps = {
  allleaguejson: false,
  onLeagueChange: false,
};

MakeLeagueList.propTypes = {
  allleaguejson: PropTypes.shape({
    year: PropTypes.number,
  }),
  onLeagueChange: PropTypes.func,
};
