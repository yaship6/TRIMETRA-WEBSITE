import React from 'react';

export default function JewelleryCareGrid({ compact = false }) {
    const careItems = [
        {
            icon: "fas fa-droplet",
            title: "Keep away from moisture"
        },
        {
            icon: "fas fa-moon",
            title: "Remove when sleeping"
        },
        {
            icon: "fas fa-spray-can",
            title: "Allow perfumes or lotion dry before wearing"
        },
        {
            icon: "fas fa-bath",
            title: "Remove before entering water"
        },
        {
            icon: "fas fa-box-archive",
            title: "Store in a closed bag or box"
        },
        {
            icon: "fas fa-dumbbell",
            title: "Remove when active"
        }
    ];

    return (
        <div className={`jewellery-care-box ${compact ? 'compact' : ''}`}>
            <div className="care-grid-container">
                {careItems.map((item, index) => (
                    <div className="care-grid-item" key={index}>
                        <div className="care-icon-wrap">
                            <i className={item.icon} />
                        </div>
                        <p className="care-item-text">{item.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
