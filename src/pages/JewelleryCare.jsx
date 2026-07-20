export default function JewelleryCare() {
    const carePoints = [
        {
            icon: "fas fa-tint-slash",
            title: "Keep Away from Moisture",
            desc: "Avoid direct contact with water, sweat, and high humidity. Always take off your jewellery before washing hands or applying sanitizers."
        },
        {
            icon: "fas fa-bed",
            title: "Remove When Sleeping",
            desc: "Sleeping with jewellery causes unwanted friction, bending, or snapping of chains, and can loosen gemstone prongs."
        },
        {
            icon: "fas fa-spray-can",
            title: "Perfumes & Lotions First",
            desc: "Always apply your perfumes, body lotions, hairsprays, and makeup first, allowing them to dry completely before wearing jewellery."
        },
        {
            icon: "fas fa-shower",
            title: "Remove Before Water Entry",
            desc: "Always remove your pieces before entering swimming pools, saunas, bathtubs, beaches, or washing dishes to avoid harsh chemicals."
        },
        {
            icon: "fas fa-box-open",
            title: "Store in Closed Bag or Box",
            desc: "Keep your pieces stored individually in airtight zip-lock bags or soft-lined Trimetra boxes to prevent oxidation and scratches."
        },
        {
            icon: "fas fa-dumbbell",
            title: "Remove When Active",
            desc: "Take off your jewellery before sports, gym workouts, heavy cleaning, or physical activities to prevent structural impact damage."
        }
    ];

    return (
        <div className="policy-page-wrapper fade-in-section">
            <h1>Jewellery Care Guide</h1>
            <p className="policy-date">Preserving Purity and Brilliance</p>

            <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
                Trimetra fine jewellery is meticulously handcrafted in pure 925 sterling silver and high-shine gold/rhodium plating. Follow our daily care guidelines to ensure your heirloom maintains its original luster for a lifetime.
            </p>

            <div className="jewellery-care-grid">
                {carePoints.map((point, index) => (
                    <div className="jewellery-care-card" key={index}>
                        <div className="jewellery-care-icon-wrap">
                            <i className={point.icon} />
                        </div>
                        <h3>{point.title}</h3>
                        <p>{point.desc}</p>
                    </div>
                ))}
            </div>


        </div>
    );
}

