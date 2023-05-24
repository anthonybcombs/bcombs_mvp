import React, { useEffect, useState } from 'react'


import './styles.css';

// import DesktopPage from './Pages/desktop/home/index.js';

// import TabletPage from './Pages/tablet/home/index.js';
// import MobilePage from './Pages/mobile/home/index.js';


// const DesktopPage = import('./Pages/desktop/home/index.js'))
// const MobilePage = React.lazy(() => import('./Pages/mobile/home/index.js'));
// const TabletPage = React.lazy(() => import('./Pages/tablet/home/index.js'));

// import './Style/desktop.css';

// const template = { __html: DesktopPage };

const LandingPage = props => {


    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);
    let LandingPageComponent = React.lazy(() => import('./Pages/desktop/home/index.js'))

    if (width <= 768) {
        LandingPageComponent = React.lazy(() => import('./Pages/mobile/home/index.js'))
    }
    // else if (width > 768 && width <= 1007) {
    //     LandingPageComponent = React.lazy(() => import('./Pages/tablet/home/index.js'))
    // }
    // else {
    //     LandingPageComponent = React.lazy(() => import('./Pages/desktop/home/index.js'))
    // }
    return <React.Suspense fallback={<></>}>
        <LandingPageComponent />
    </React.Suspense>


};

export default LandingPage