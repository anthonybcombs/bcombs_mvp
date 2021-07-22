import React from 'react';

const MetricMenu = props => {
    const { handleSelectedLabel, selectedLabel } = props;
    return <div>
        <div id="labels">
            <h3>Labels</h3>
            <div
                className={`${selectedLabel === "Menu 1" ? "selected" : ""}`}
                onClick={() => {
                    handleSelectedLabel("Menu 1");
                }}
            >
                <span>Menu 1</span>
                <span>Value: </span>
            </div>
            <div
                className={`${selectedLabel === "Menu 2" ? "selected" : ""}`}
                onClick={() => {
                    handleSelectedLabel("Menu 2");
                }}
            >
                <span>Menu 2</span>
            </div>

        </div>
    </div>
}

export default MetricMenu;