import './index.css'

export function About() {
    return (
        <>
            <div class="bannerHeader">
                <div class="row">
                    <h1>About Our Project</h1>
                    <div class="bannerContainer">
                    </div>
                </div>
            </div>

            <p>Our project aims to provides users with in depth visual information about
                flight delay data across dates, airports, and carriers. The data will provide various forms
                of information graphics including, rankings, tables, and data charts. The user will also be provided
                robust and interactive features that can summarize and filter data. Users can also
                create, edit, and remove data which will be dynamically updated on the website.
            </p>
            <p>Some features include:</p>
            <ul>
                <li>A slider which filters all data to a single date</li>
                <li>A range slider to filter data to a date range</li>
                <li>A selection of which airport to display</li>
                <li>A selection of which carrier to display</li>
                <li>A ranking of airports with the most delays</li>
                <li>A ranking of carriers with the most delays</li>
                <li>A chart of the most common reasons for delays</li>
            </ul>
        </>
    );
}