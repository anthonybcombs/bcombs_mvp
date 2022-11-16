import React, { useEffect, useState } from 'react'


import './styles.css';

// import DesktopPage from './Pages/desktop/home/index.js';
// import MobilePage from './Pages/mobile/home/index.js';


const DesktopPage = React.lazy(() => import('./Pages/desktop/home/index.js'));
const MobilePage = React.lazy(() => import('./Pages/mobile/home/index.js'));

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

    const isMobile = width <= 768;


    return <>
        <React.Suspense fallback={<></>}>
            {isMobile ? <MobilePage /> : <DesktopPage />}
        </React.Suspense>
    </>

};

export default LandingPage