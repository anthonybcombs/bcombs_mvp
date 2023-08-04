import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import '../../../Style/mobile.css';
import './style.css';

// import BcombsAppBlackText from '../../../Resources/images/BCombs-App-Black-text-1920w.png'
// import AppMobile from '../../../Resources/images/BCombs-App-Mobile-1920w.png';
// import BcombsFinalLogo from '../../../Resources/images/BCombs_Final-Logo2-1920w.png';
import PaperAndPen from '../../../Resources/images/Paper-and-pen-640w.jpg';
import Excel from "../../../Resources/images/Excel-640w.jpg";
import OnlineForm from '../../../Resources/images/Online-form-640w.jpg';
// import MetricAndAnalysis from '../../../Resources/images/Operations-DataTracking-MetricAnalysis_1-396w.png';
import BenefitsDelivered from '../../..//Resources/images/Benefits-Delivered-396w.png';
import BcombsSiteIcon from '../../../Resources/images/BCombs_Site-icon-90w.png';

import BcombsAppBlackText270 from '../../../Resources/images/BCombs-App-Black-text-270w.png';
import BcombsAppBlackText360 from '../../../Resources/images/BCombs-App-Black-text-360w.png';
import BcombsAppMobile432 from '../../../Resources/images/BCombs-App-Mobile-432w.png';
import BcombsAppFinalLogo138 from '../../../Resources/images/BCombs_Final-Logo2-138w.png';

import DesktopMetrics from '../../../Resources/images/desktop_bcombs_landing_img1.webp';
import DesktopBcombsApp from '../../../Resources/images/bcombs_app.webp'
import DesktopBcombsFooter from '../../../Resources/images/bcombs_footer_latest.webp'
import DesktopBcombsLatestMainBg from '../../../Resources/images/bcombs_latest_main_bg.webp'

const MobilePage = props => {


    const { auth } = useSelector(state => {
        return {
            auth: state.auth
        }
    });

    const demoScheduleRef = useRef(null);

    const [clientDetails, setClientDetails] = useState({
        organizationName: '',
        organizationType: '',
        organizationSize: '',
        websiteUrl: '',
        fullName: '',
        clientEmail: '',
        contactNo: ''
    });
    const [isSending, setIsSending] = useState(false);
    const [isSendSuccess, setIsSendSuccess] = useState(false);
    const [isSubmitError, setIsSubmitError] = useState(false);

    const handleClientDetailChange = e => {
        const { name, value } = e.target;
        setClientDetails({
            ...clientDetails,
            [name]: value
        });
    };

    const handleSendDemoRequest = async () => {
        try {

            setIsSending(true);
            setIsSendSuccess(false);
            setIsSubmitError(false);

            if (clientDetails.organizationName &&
                clientDetails.organizationType &&
                clientDetails.organizationSize &&
                clientDetails.websiteUrl &&
                clientDetails.fullName &&
                clientDetails.clientEmail &&
                clientDetails.contactNo
            ) {
                const apiUrl = `${process.env.API_HOST}/api/demo_schedule/request`;
                console.log('apiUrl', apiUrl)
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    // mode: 'cors',
                    cache: 'no-cache',
                    //          credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    //   redirect: 'follow',
                    // referrerPolicy: 'no-referrer', 
                    body: JSON.stringify(clientDetails)
                });


                response.json();
                setIsSendSuccess(true);

            }
            else {
                setIsSubmitError(true);
            }

        } catch (e) {

        }
        finally {
            setIsSending(false);
            setClientDetails({
                organizationName: '',
                organizationType: '',
                organizationSize: '',
                websiteUrl: '',
                fullName: '',
                clientEmail: '',
                contactNo: ''
            })
        }
    }


    return <div id="dm" className="dmwr">

        <div className="dm_wrapper mobileHamburgerLayout-var5 null mobileHamburgerLayout">
            {" "}
            <div
                dmwrapped="true"
                id={1901957768}
                className="dm-home-page"
                themewaschanged="true"
            >

                <div
                    dmtemplateid="mobileHamburgerLayout"
                    className="runtime-module-container dm-bfs dm-layout-home hasAnimations rows-1200 hamburger-reverse layout-drawer_fixed-header dmPageBody d-page-1716942098 dmFreeHeader"
                    id="dm-outer-wrapper"
                    data-page-class={1716942098}
                    data-buttonstyle="THICK_BORDER_ROUND"
                    data-soch="true"
                    data-background-parallax-selector=".dmHomeSection1, .dmSectionParallex"
                >
                    {" "}
                    <div id="dmStyle_outerContainer" className="dmOuter">
                        {" "}
                        <div id="dmStyle_innerContainer" className="dmInner">
                            {" "}
                            <div className="dmLayoutWrapper standard-var dmStandardMobile">
                                {" "}
                                <div id="site_content">
                                    {" "}
                                    <div className="p_hfcontainer">
                                        {" "}
                                        <div
                                            id="mobile-hamburger-drawer"
                                            className="hamburger-drawer layout-drawer"
                                            layout="821367d17e7e4800ae3cef3feee092b1===header"
                                            data-origin="top"
                                            data-auto-height="true"

                                        >

                                        </div>
                                        <div
                                            className="layout-drawer-overlay"
                                            id="layout-drawer-overlay"
                                        />
                                    </div>
                                    <div className="site_content">
                                        {" "}
                                        <div
                                            id="hamburger-header-container"
                                            className="hamburger-header-container p_hfcontainer"
                                        >
                                            {" "}
                                            <div
                                                id="mobile-hamburger-header"
                                                className="hamburger-header p_hfcontainer"
                                                layout="837ce1cb59c8431ea7fd0dcd9b0a381f===header"
                                                has-shadow="true"
                                            >
                                                {" "}
                                                <div
                                                    className="dmRespRow dmDefaultListContentRow u_1400667849 fullBleedChanged fullBleedMode"
                                                    style={{ textAlign: "center" }}
                                                    id={1400667849}
                                                    mode={2}
                                                >
                                                    {" "}
                                                    <div className="dmRespColsWrapper" id={1997122336}>
                                                        {" "}

                                                        <div
                                                            className="u_1576678267 dmRespCol medium-4 large-4 small-4"
                                                            id={1576678267}
                                                        >
                                                            <div style={{ textAlign: 'right' }} className=" dmRespCol small-12 large-7 medium-7" id={1044536395}>
                                                                <a href={auth?.user_id ? '/dashboard' : '/login'} className=" align-center dmButtonLink dmWidget dmWwr default dmOnlyButton dmDefaultGradient" file="false" style={{ backgroundColor: 'black', color: 'white', textAlign: 'center', margin: 0, width: 120 }} >
                                                                    <span className="iconBg" aria-hidden="true" style={{ backgroundColor: '#fa7507' }} id={1210537932}> <span className="icon hasFontIcon icon-star" id={1549847048} />
                                                                    </span>
                                                                    <span className="text" style={{ fontSize: 12 }} id={1255045965}>{auth?.user_id ? 'GO TO DASHBOARD' : 'USER LOGIN'}</span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="u_1576678267 dmRespCol medium-8 large-8 small-8"
                                                            id={1576678267}
                                                        >
                                                            {" "}
                                                            <div
                                                                className="u_1210932970 imageWidget align-center"
                                                                data-element-type="image"
                                                                data-widget-type="image"
                                                                id={1210932970}
                                                            >
                                                                {" "}
                                                                <a
                                                                    href="./"
                                                                    id={1285598142}
                                                                    raw_url="/home/"
                                                                    data-target-page-alias="home"
                                                                >
                                                                    <img
                                                                        src={BcombsAppBlackText270}
                                                                        id={1815137754}
                                                                        className=""
                                                                        data-dm-image-path={BcombsAppBlackText270}
                                                                        style={{ width: 180 }}
                                                                    // width={554}
                                                                    // height={101}
                                                                    // onError="handleImageLoadError(this)"
                                                                    />
                                                                </a>
                                                            </div>
                                                        </div>


                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            dmwrapped="true"
                                            id={1901957768}
                                            className="dmBody u_dmStyle_template_home dm-home-page"
                                            themewaschanged="true"
                                        >
                                            {" "}
                                            <div id="allWrapper" className="allWrapper">
                                                {/* navigation placeholders */}{" "}
                                                <div id="dm_content" className="dmContent">
                                                    {" "}
                                                    <div
                                                        dmTemplateorder={170}
                                                        className="dmHomeRespTmpl mainBorder dmRespRowsWrapper dmFullRowRespTmpl"
                                                        id={1716942098}
                                                    >
                                                        {" "}
                                                        <div
                                                            className="u_1774361545 dmRespRow fullBleedChanged fullBleedMode"
                                                            id={1774361545}
                                                        >
                                                            {" "}
                                                            <div
                                                                className="dmRespColsWrapper"
                                                                id={1112975304}
                                                            >
                                                                {" "}
                                                                <div
                                                                    className="dmRespCol small-12 medium-12 large-12 u_1414238043"
                                                                    id={1414238043}
                                                                >
                                                                    {" "}
                                                                    <div
                                                                        className="dmRespRow u_1164260568 mobile-columns-reversed"
                                                                        id={1164260568}
                                                                    >
                                                                        {" "}
                                                                        <div
                                                                            className="dmRespColsWrapper"
                                                                            id={1596779468}
                                                                        >
                                                                            {" "}

                                                                            <div
                                                                                className="u_1453347549 dmRespCol small-12 large-7 medium-7"
                                                                                id={1453347549}
                                                                            >
                                                                                {" "}
                                                                                <div
                                                                                    className="dmNewParagraph u_1787721266"
                                                                                    data-element-type="paragraph"
                                                                                    data-version={5}
                                                                                    id={1787721266}
                                                                                    style={{
                                                                                        transition: "none 0s ease 0s",
                                                                                        textAlign: "center",
                                                                                        display: "block",
                                                                                        paddingTop: 24
                                                                                    }}
                                                                                >
                                                                                    {" "}

                                                                                    <br />
                                                                                    <h1
                                                                                        className="m-text-align-center "
                                                                                        style={{ lineHeight: "1.7", textAlign: 'center', fontSize: 20 }}
                                                                                    >
                                                                                        {" "}
                                                                                        <div
                                                                                            style={{ display: "block", color: 'black' }}
                                                                                        >
                                                                                            WE HELP YOUTH
                                                                                        </div>
                                                                                        <div
                                                                                            style={{ display: "block", color: 'black' }}
                                                                                        >
                                                                                            ORGANIZATIONS
                                                                                        </div>
                                                                                    </h1>
                                                                                    <h1
                                                                                        className="m-text-align-center "
                                                                                        style={{ lineHeight: "1.7", textAlign: 'center', fontSize: 20 }}
                                                                                    >
                                                                                        {" "}
                                                                                        <span
                                                                                            style={{ display: "initial" }}
                                                                                        >
                                                                                            SAVE TIME.
                                                                                        </span>
                                                                                    </h1>
                                                                                    <h1
                                                                                        className="m-text-align-center "
                                                                                        style={{ lineHeight: "1.7", textAlign: 'center', fontSize: 20 }}
                                                                                    >
                                                                                        {" "}
                                                                                        <span
                                                                                            style={{ display: "initial" }}
                                                                                        >
                                                                                            REDUCE EFFORT.
                                                                                        </span>
                                                                                    </h1>
                                                                                    <h1
                                                                                        className="m-text-align-center"
                                                                                        style={{ lineHeight: "1.7", textAlign: 'center', fontSize: 20 }}
                                                                                    >
                                                                                        {" "}
                                                                                        <span
                                                                                            style={{ display: "initial" }}
                                                                                        >
                                                                                            INCREASE IMPACT.
                                                                                        </span>
                                                                                    </h1>
                                                                                </div>

                                                                                <div style={{ textAlign: 'center' }}>
                                                                                    <a onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        demoScheduleRef.current.scrollIntoView()
                                                                                    }}
                                                                                        dataDisplayType="block"
                                                                                        className=" align-center dmButtonLink dmWidget dmWwr default dmOnlyButton dmDefaultGradient"
                                                                                        style={{
                                                                                            width: 180
                                                                                        }}
                                                                                        file="false" href="./#Contact" dataElementType="dButtonLinkId" id={1632178657} raw_url="/home/"> <span className="iconBg" aria-hidden="true" id={1592183381}> <span className="icon hasFontIcon icon-star" id={1337130365} />
                                                                                        </span>
                                                                                        <span style={{
                                                                                            fontSize: 14
                                                                                        }} className="text" id={1050213959}>REQUEST A DEMO</span>
                                                                                    </a>
                                                                                </div>

                                                                                {/* <a
                                                                                    data-display-type="block"
                                                                                    className=" align-center dmButtonLink dmWidget dmWwr default dmOnlyButton dmDefaultGradient"
                                                                                    file="false"
                                                                                    href="#schedule-demo"
                                                                                    data-element-type="dButtonLinkId"
                                                                                    id={1265853154}
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        demoScheduleRef.current.scrollIntoView()
                                                                                    }}
                                                                                    style={{
                                                                                        width: 180
                                                                                    }}
                                                                                >
                                                                                    {" "}
                                                                                    <span
                                                                                        className="iconBg"
                                                                                        aria-hidden="true"
                                                                                        id={1210537932}
                                                                                    >
                                                                                        {" "}
                                                                                        <span
                                                                                            className="icon hasFontIcon icon-star"
                                                                                            id={1549847048}
                                                                                        />
                                                                                    </span>
                                                                                    <span
                                                                                        className="text"
                                                                                        id={1255045965}
                                                                                        style={{

                                                                                            fontSize: 14
                                                                                        }}
                                                                                    >
                                                                                        REQUEST A DEMO
                                                                                    </span>
                                                                                </a> */}
                                                                            </div>
                                                                            <div
                                                                                className="u_1058420149 dmRespCol small-12 large-5 medium-5"
                                                                                id={1058420149}
                                                                            >
                                                                                {" "}
                                                                                <div
                                                                                    className="imageWidget align-center u_1915808864"
                                                                                    data-element-type="image"
                                                                                    data-widget-type="image"
                                                                                    id={1915808864}
                                                                                    data-anim-desktop="none"
                                                                                >
                                                                                    <img
                                                                                        src={BcombsAppMobile432}
                                                                                        alt=""
                                                                                        id={1727884396}
                                                                                        className=""
                                                                                        data-dm-image-path={BcombsAppMobile432}
                                                                                        width={320}
                                                                                        height={'auto'}
                                                                                        style={{
                                                                                            width: 300,
                                                                                            height: 'auto'
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className=" dmRespRow " id={1654014440} style={{ paddingLeft: 40, paddingRight: 40 }}>

                                                            <div className="dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1408625624}>
                                                                <h2 className="text-align-center" style={{ textAlign: 'center', color: 'black' }}>
                                                                    <span style={{ display: 'unset', color: 'black' }}>Get More Done With Less Effort</span>
                                                                </h2>
                                                                <div style={{ borderTop: '2px solid #FFC100', width: 77, margin: '0 auto' }}></div>
                                                                <div style={{ marginLeft: 20, marginRight: 20 }} className="dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1953423639}>
                                                                    <p className="text-align-center"> <span style={{ display: 'unset', fontSize: 15 }}>As a youth mentoring organization, you must keep up with the ever-growing demand for your services while trying to manage limited resources. You and your team may also feel stretched thin trying to keep up with the data you need to renew grants.</span>
                                                                    </p>

                                                                    <p className="text-align-center"> <span style={{ display: 'unset', fontSize: 15 }}>Tracking and analyzing your organizational impact across different metrics can be challenging, especially if you're inputting information into multiple applications.</span>
                                                                    </p>

                                                                </div>

                                                                <div className=" dmNewParagraph" dataElementType="paragraph" style={{ marginTop: 12, marginLeft: 35, marginRight: 35 }}>

                                                                    <p className="text-align-center"> <div style={{ display: 'unset', fontSize: 17, color: 'black', fontWeight: 'bold' }}>
                                                                        With our software solution, you can easily compile and retain data to reduce the time and
                                                                    </div>
                                                                        <div style={{ display: 'unset', fontSize: 19, color: 'black', fontWeight: 'bold' }}>
                                                                            energy spent entering information.
                                                                        </div>
                                                                    </p>


                                                                </div>
                                                                <div className="dmRespCol small-12 medium-12 large-12 u_1414238043" id={1414238043}>
                                                                    <div className="dmRespRow mobile-columns-reversed" id={1164260568} style={{
                                                                        paddingLeft: 0,
                                                                        paddingRight: 0
                                                                    }}>
                                                                        <div className="dmRespColsWrapper" id={1596779468}>
                                                                            <br />
                                                                            <div className="u_1453347549 dmRespCol small-12 large-12 medium-12" style={{ textAlign: 'center', fontSize: 15 }} id={1453347549}>
                                                                                Our streamlined alternative helps you simplify your operation’s informational input and analyze your organizational impact across metrics, giving you more time and energy to devote to the youth you serve.
                                                                            </div>
                                                                            <br />
                                                                            <div className="u_1058420149 dmRespCol small-12 large-12 medium-12" id={1058420149}>
                                                                                <div dataElementType="image" dataWidgetType="image" id={1915808864} data-anim-desktop="none"><img src={DesktopMetrics} alt="" dataDmImagePath="/Resources/images/desktop_bcombs_landing_img1.webp" width="650" height="auto" onerror="handleImageLoadError(this)" />
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div style={{ textAlign: 'center', marginTop: 30 }} className="dmRespCol small-12 medium-12 large-12 u_1414238043" id={1414238043}>

                                                                    <a onClick={(e) => {
                                                                        e.preventDefault()
                                                                        demoScheduleRef.current.scrollIntoView()
                                                                    }} dataDisplayType="block"
                                                                        className=" align-center dmButtonLink dmWidget dmWwr default dmOnlyButton dmDefaultGradient"
                                                                        file="false" dataElementType="dButtonLinkId" style={{ width: 180, backgroundColor: '#fa7507', textAlign: 'center', margin: 0 }} id={1265853154} raw_url="/home/"> <span className="iconBg" aria-hidden="true" style={{ backgroundColor: '#fa7507' }} id={1210537932}> <span className="icon hasFontIcon icon-star" id={1549847048} />
                                                                        </span>
                                                                        <span style={{
                                                                            fontSize: 14
                                                                        }} className="text" id={1255045965}>REQUEST A DEMO</span>
                                                                    </a>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="u_1774361545 dmRespRow fullBleedChanged fullBleedMode" id={1774361545}>
                                                            <div className="dmRespColsWrapper" id={1027462133} style={{
                                                                background: ' url("https://images.leadconnectorhq.com/img/f_webp/q_95/r_1200/u_https://assets.cdn.filesafe.space/ZSktP9MyMGxLhmmN6Cjj/media/63d03c5b29f84e65812c31f0.png")',
                                                                opacity: 1,

                                                            }}>
                                                                <div className="dmRespCol large-12 medium-12 small-12" id={1301741309} style={{ paddingLeft: 40, paddingRight: 40 }} >
                                                                    <div style={{ paddingTop: 36 }} className="dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1408625624}>
                                                                        <div className="text-align-center" style={{ textAlign: 'center' }}>
                                                                            <h2 style={{ display: 'unset', color: 'white' }}>

                                                                                Focus on What Matters

                                                                            </h2>
                                                                        </div>
                                                                        <div className="text-align-center" style={{ textAlign: 'center' }}> <h3 style={{ display: 'unset', color: 'white' }}>The automation needed to enhance your mission</h3>
                                                                        </div>
                                                                    </div>

                                                                    <div className="dmRespRow u_1826450282" id={1826450282}>
                                                                        <div className="dmRespColsWrapper" id={1844629233}>
                                                                            <div className="dmRespCol large-12 medium-12 small-12" id={1404997756}>
                                                                                <div style={{ borderTop: '2px solid #FFC100', width: 77, margin: '0 auto' }}></div>
                                                                                {/* <div className="u_1379829330 dmDividerWrapper clearfix" dataElementType="dDividerId" dataLayout="divider-style-1" dataWidgetVersion={2} id={1379829330}>
                                                                                    <hr className="dmDivider" style={{ borderWidth: '2px', borderTopStyle: 'solid', color: 'grey' }} id={1983256713} />
                                                                                </div> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div >
                                                                        <div >
                                                                            {/* <div id={1047738323}>
                                                                                <div id={1440166053}>
                                                                                    <div  id={1701177513}>
                                                                                      
                                                                                        <div className="u_1093381198 dmRespCol small-12 large-12 medium-12" id={1093381198}>
                                                                                    
                                                                                            <img src={DesktopBcombsApp}
                                                                                             
                                                                                            />
                                                                                           
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div> */}
                                                                            <div style={{ textAlign: 'center' }}>   <img src={DesktopBcombsApp}
                                                                                style={{ width: 300, height: 200 }}
                                                                            />

                                                                            </div>
                                                                            <div style={{ textAlign: 'left', color: 'white' }}>
                                                                                <div style={{ color: 'white', marginTop: 4, marginBottom: 4, fontSize: 20 }}><div style={{ display: 'inline' }} className="custom-checked-circle">✓</div>  <div style={{ display: 'inline' }} >Track needed Metrics</div></div>

                                                                                <div style={{ color: 'white', marginTop: 4, marginBottom: 4, fontSize: 20, marginTop: 5 }}><div style={{ display: 'inline' }} className="custom-checked-circle">✓</div>  <div style={{ display: 'inline' }}> User friendly design and experience</div></div>

                                                                                <div style={{ color: 'white', marginTop: 4, marginBottom: 4, fontSize: 20, marginTop: 5 }}><div style={{ display: 'inline' }} className="custom-checked-circle">✓</div>  <div style={{ display: 'inline' }}>  Aggregate data</div></div>

                                                                                <div style={{ color: 'white', marginTop: 4, marginBottom: 4, fontSize: 20, marginTop: 5 }}><div style={{ display: 'inline' }} className="custom-checked-circle">✓</div>  <div style={{ display: 'inline' }}>  Streamline communication</div></div>

                                                                                <div style={{ color: 'white', marginTop: 4, marginBottom: 4, fontSize: 20, marginTop: 5 }}><div style={{ display: 'inline' }} className="custom-checked-circle">✓</div>  <div style={{ display: 'inline' }}>  Automate process and Standardize data collection, across organization</div></div>

                                                                                <div style={{ color: 'white', marginTop: 4, marginBottom: 4, fontSize: 20, marginTop: 5 }}><div style={{ display: 'inline' }} className="custom-checked-circle">✓</div>  <div style={{ display: 'inline' }} >  Reduce effort and time needed to collect, analyze and store data</div></div>
                                                                            </div>
                                                                            {/* <div id={1047738323}>
                                                                                <div id={1440166053}>
                                                                                    <div className="dmRespColsWrapper" id={1701177513}>

                                                                                        <div className="u_1564374366 dmRespCol small-12 large-2 medium-2" id={1564374366}>
                                                                                            <div className="graphicWidget u_1711906424" dataElementType="graphic" dataWidgetType="graphic" id={1711906424}>

                                                                                            </div>
                                                                                        </div>
                                                                                     
                                                                                    </div>
                                                                                </div>
                                                                            </div> */}

                                                                        </div>
                                                                    </div>
                                                                    <div style={{ textAlign: 'center' }}>
                                                                        <a onClick={(e) => {
                                                                            e.preventDefault()
                                                                            demoScheduleRef.current.scrollIntoView()
                                                                        }}
                                                                            dataDisplayType="block"
                                                                            className=" align-center dmButtonLink dmWidget dmWwr default dmOnlyButton dmDefaultGradient"
                                                                            style={{
                                                                                width: 180
                                                                            }}
                                                                            file="false" href="./#Contact" dataElementType="dButtonLinkId" id={1632178657} raw_url="/home/"> <span className="iconBg" aria-hidden="true" id={1592183381}> <span className="icon hasFontIcon icon-star" id={1337130365} />
                                                                            </span>
                                                                            <span style={{
                                                                                fontSize: 14
                                                                            }} className="text" id={1050213959}>REQUEST A DEMO</span>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className=" dmRespRow fullBleedChanged fullBleedMode" id="DealingWith" dataAnchor="Dealing With">
                                                            <div className="dmRespColsWrapper" id={1064648953}>
                                                                <div className="dmRespCol small-12 medium-12 large-12 u_1186442835" id={1186442835}>
                                                                    <div className="u_1326275788 dmRespRow fullBleedChanged fullBleedMode" id={1326275788}>
                                                                        <div className="dmRespColsWrapper" id={1788689674}>
                                                                            <div className="dmRespCol large-12 medium-12 small-12" id={1050198982}>
                                                                                <div dataElementType="spacer" className="dmSpacer u_1263248984" id={1263248984} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="dmRespRow u_1243131435 mobile-columns-reversed" id={1243131435}>
                                                                        <div className="dmRespColsWrapper" id={1619431296}>
                                                                            <div className="u_1056072134 dmRespCol small-12 medium-12 large-12" id={1056072134}>
                                                                                <div className="dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1134221766}>
                                                                                    <h2 className="text-align-center" style={{ textAlign: 'center' }}>
                                                                                        <span style={{ color: 'rgb(255, 255, 255)', display: 'unset', textAlign: 'center', color: 'black' }}>
                                                                                            How b.combs Can Help Your Organization
                                                                                        </span>
                                                                                    </h2>

                                                                                    <div className="text-align-center" style={{ textAlign: 'center' }}>
                                                                                        <span style={{ color: 'rgb(255, 255, 255)', display: 'unset', textAlign: 'center', color: 'black', fontSize: 24 }}>
                                                                                            We help youth mentoring nonprofits work more efficiently so they can focus on their mission, including these areas:
                                                                                        </span>
                                                                                    </div>

                                                                                </div>
                                                                                <div style={{ borderTop: '2px solid #FFC100', width: 77, margin: '0 auto' }}></div>
                                                                                <div className="dmRespRow u_1322998342" id={1322998342}>
                                                                                    <div className="dmRespColsWrapper" id={1315874093}>
                                                                                        <div className="dmRespCol large-12 medium-12 small-12" id={1425982292}>
                                                                                            <div className="u_1090237037 dmDividerWrapper clearfix" dataElementType="dDividerId" dataLayout="divider-style-1" dataWidgetVersion={2} id={1090237037}>
                                                                                                <hr className="dmDivider" style={{ borderWidth: '2px', borderTopStyle: 'solid', color: 'grey' }} id={1946715382} />
                                                                                            </div>
                                                                                            <div className="u_1965238513 dmDividerWrapper clearfix" dataElementType="dDividerId" dataLayout="divider-style-1" dataWidgetVersion={2} id={1965238513}>
                                                                                                <hr className="dmDivider" style={{ borderWidth: '2px', borderTopStyle: 'solid', color: 'grey' }} id={1369622986} />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className=" dmRespRow" id={1132618911} style={{ backgroundColor: 'transparent' }}>
                                                                                    {/* <div className="dmRespColsWrapper" id={1615731814}>
                                                                                             
                                                                                            </div> */}

                                                                                    <div className="dmRespRow u_1287229030" id={1287229030}>
                                                                                        <div id={1294397268}>
                                                                                            <div style={{
                                                                                                margin: 5,
                                                                                                backgroundImage: 'linear-gradient(#FBA400, #fa7507)',
                                                                                                borderRadius: 20
                                                                                            }} className=" dmRespCol small-12 large-undefined medium-undefined medium-12 large-12" id="1073903950">
                                                                                                <div className="u_1586563672 dmRespRow" id="1586563672"> <div className="dmRespColsWrapper" id="1758924848">
                                                                                                    <div className=" dmNewParagraph" data-element-type="paragraph" data-version="5" id="1860902120" style={{
                                                                                                        transition: 'none 0s ease 0s',
                                                                                                        textAlign: 'center',
                                                                                                        width: '100%'
                                                                                                    }}> <h4 className="m-text-align-center">
                                                                                                            <div style={{ textAlign: 'center', color: 'white', fontSize: 22 }}>Administration</div>
                                                                                                            <div style={{ textAlign: 'center', color: 'white', fontSize: 20 }}> Workflow Management</div>
                                                                                                        </h4>
                                                                                                        <br />
                                                                                                        <div style={{ borderTop: '2px solid #FFC100', width: 77, margin: '0 auto' }}></div>
                                                                                                        <br />
                                                                                                        <div style={{ textAlign: 'left' }}>

                                                                                                            <ul className="custom-list" style={{ textAlign: 'left', color: 'white' }}>
                                                                                                                <li style={{ marginTop: 12, marginBottom: 12, fontSize: 20 }}>Standardize forms and documents</li>
                                                                                                                <li style={{ marginTop: 12, marginBottom: 12, fontSize: 20 }}>Implement best practices across groups and locations</li>
                                                                                                                <li style={{ marginTop: 12, marginBottom: 12, fontSize: 20 }} >Share program information</li>
                                                                                                                <li style={{ marginTop: 12, marginBottom: 12, fontSize: 20 }}> Manage data needed for Federal, State, and Local grant-funded programs</li>
                                                                                                            </ul>


                                                                                                        </div>

                                                                                                    </div>

                                                                                                </div>
                                                                                                </div>


                                                                                            </div>

                                                                                            <div style={{
                                                                                                margin: 5,
                                                                                                backgroundImage: 'linear-gradient(#FBA400, #fa7507)',
                                                                                                borderRadius: 20
                                                                                            }} className=" dmRespCol small-12 large-undefined medium-undefined medium-12 large-12" id="1073903950">
                                                                                                <div className="u_1586563672 dmRespRow" id="1586563672"> <div className="dmRespColsWrapper" id="1758924848">
                                                                                                    <div className=" dmNewParagraph" data-element-type="paragraph" data-version="5" id="1860902120" style={{
                                                                                                        transition: 'none 0s ease 0s',
                                                                                                        textAlign: 'center',
                                                                                                        width: '100%'
                                                                                                    }}> <h4 className="m-text-align-center"><div style={{ textAlign: 'center', color: 'white', fontSize: 20 }}>Engagement</div>
                                                                                                            <div style={{ textAlign: 'center', color: 'white', fontSize: 20 }}>  Management</div>
                                                                                                        </h4>
                                                                                                        <br />
                                                                                                        <div style={{ borderTop: '2px solid #FFC100', width: 77, margin: '0 auto' }}></div>
                                                                                                        <br />
                                                                                                        <div style={{ textAlign: 'left' }}>

                                                                                                            <ul className="custom-list" style={{ textAlign: 'left', color: 'white' }}>
                                                                                                                <li style={{ marginTop: 12, marginBottom: 12, fontSize: 20 }}>Streamline Communication within your organization and community</li>
                                                                                                                <li style={{ marginTop: 12, marginBottom: 12, fontSize: 20 }}>Manage youth and family engagement</li>
                                                                                                                <li style={{ marginTop: 12, marginBottom: 12, fontSize: 20 }}>Share events and activities</li>

                                                                                                            </ul>


                                                                                                        </div>
                                                                                                    </div>

                                                                                                </div>
                                                                                                </div>


                                                                                            </div>


                                                                                            <div style={{
                                                                                                margin: 5,
                                                                                                backgroundImage: 'linear-gradient(#FBA400, #fa7507)',
                                                                                                borderRadius: 20
                                                                                            }} className=" dmRespCol small-12 large-undefined medium-undefined medium-12 large-12" id="1073903950">
                                                                                                <div className="u_1586563672 dmRespRow" id="1586563672"> <div className="dmRespColsWrapper" id="1758924848">
                                                                                                    <div className=" dmNewParagraph" data-element-type="paragraph" data-version="5" id="1860902120" style={{
                                                                                                        transition: 'none 0s ease 0s',
                                                                                                        textAlign: 'center',
                                                                                                        width: '100%'
                                                                                                    }}> <h4 className="m-text-align-center"><div style={{ textAlign: 'center', color: 'white', fontSize: 20 }}>Data Aggregation,</div>
                                                                                                            <div style={{ textAlign: 'center', color: 'white', fontSize: 20 }}>  Visualization, and Analysis</div>
                                                                                                        </h4>
                                                                                                        <br />
                                                                                                        <div style={{ borderTop: '2px solid #FFC100', width: 77, margin: '0 auto' }}></div>
                                                                                                        <br />
                                                                                                        <div style={{ textAlign: 'left' }}>

                                                                                                            <ul className="custom-list" style={{ textAlign: 'left', color: 'white' }}>
                                                                                                                <li style={{ marginTop: 12, marginBottom: 12, fontSize: 20 }}>Evaluate metrics of programs</li>
                                                                                                                <li style={{ marginTop: 12, marginBottom: 12, fontSize: 20 }}>Centralize and visualize critical data</li>
                                                                                                                <li style={{ marginTop: 12, marginBottom: 12, fontSize: 20 }}>Obtain real-time and actionable data</li>

                                                                                                            </ul>


                                                                                                        </div>
                                                                                                    </div>

                                                                                                </div>
                                                                                                </div>


                                                                                            </div>
                                                                                        </div>


                                                                                    </div>

                                                                                </div>
                                                                                <div style={{ textAlign: 'center' }}>
                                                                                    <a onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        demoScheduleRef.current.scrollIntoView()
                                                                                    }}
                                                                                        dataDisplayType="block"
                                                                                        className=" align-center dmButtonLink dmWidget dmWwr default dmOnlyButton dmDefaultGradient"
                                                                                        style={{
                                                                                            width: 180
                                                                                        }}
                                                                                        file="false" href="./#Contact" dataElementType="dButtonLinkId" id={1632178657} raw_url="/home/"> <span className="iconBg" aria-hidden="true" id={1592183381}> <span className="icon hasFontIcon icon-star" id={1337130365} />
                                                                                        </span>
                                                                                        <span style={{
                                                                                            fontSize: 14
                                                                                        }} className="text" id={1050213959}>REQUEST A DEMO</span>
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="u_1415768930 dmRespRow fullBleedChanged fullBleedMode" id={1415768930}>
                                                                        <div className="dmRespColsWrapper" id={1166958241}>
                                                                            <div className="dmRespCol large-12 medium-12 small-12" id={1445517311}>
                                                                                <div dataElementType="spacer" className="dmSpacer u_1420853938" id={1420853938} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div ref={demoScheduleRef} className=" dmRespRow fullBleedChanged fullBleedMode" id="Contact" dataAnchor="Contact">
                                                            <div className="dmRespColsWrapper" id={1853815227}>
                                                                <div className="dmRespCol small-12 medium-12 large-12  " id={1626947179}>
                                                                    {/* <div className=" dmRespRow fullBleedChanged fullBleedMode" id={1555869260}>
                                                                                <div className="dmRespColsWrapper" id={1521935292}>
                                                                                    <div className="dmRespCol large-12 medium-12 small-12" id={1342380590}>
                                                                                        <div dataElementType="spacer" className="dmSpacer u_1829268807" id={1829268807} />
                                                                                    </div>
                                                                                </div>
                                                                            </div> */}
                                                                    <div className="dmRespRow u_1980259185 mobile-columns-reversed" id={1980259185}>
                                                                        <div className="dmRespColsWrapper" id={1305498215}>
                                                                            <div className="u_1459125012 dmRespCol small-12 medium-12 large-12" id={1459125012}>
                                                                                <div className="dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1410395482}>
                                                                                    <div className="dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1134221766}>
                                                                                        <h2 className="text-align-center" style={{ textAlign: 'center' }}>
                                                                                            <span style={{ color: 'rgb(255, 255, 255)', display: 'unset', textAlign: 'center', color: 'black' }}>
                                                                                                Schedule a Demo
                                                                                            </span>
                                                                                        </h2>

                                                                                        <div className="text-align-center" style={{ textAlign: 'center' }}>
                                                                                            <span style={{ color: 'rgb(255, 255, 255)', display: 'unset', textAlign: 'center', color: 'black', fontSize: 22 }}>
                                                                                                Request a demo below to find out more about how
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="text-align-center" style={{ textAlign: 'center' }}>
                                                                                            <span style={{ color: 'rgb(255, 255, 255)', display: 'unset', textAlign: 'center', color: 'black', fontSize: 22 }}>
                                                                                                our award-winning b.combs can help your organization!
                                                                                            </span>
                                                                                        </div>
                                                                                        <br />
                                                                                        <div style={{ borderTop: '2px solid #FFC100', width: 77, margin: '0 auto' }}></div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="dmRespRow u_1490776218" id={1490776218}>
                                                                                    <div className="dmRespColsWrapper" id={1359750392}>
                                                                                        <div className="dmRespCol large-12 medium-12 small-12" id={1483143547}>
                                                                                            <div className="u_1949762416 dmDividerWrapper clearfix" dataElementType="dDividerId" dataLayout="divider-style-1" dataWidgetVersion={2} id={1949762416}>
                                                                                                <hr className="dmDivider" style={{ borderWidth: '2px', borderTopStyle: 'solid', color: 'grey' }} id={1096438539} />
                                                                                            </div>
                                                                                            <div className="u_1441211015 dmDividerWrapper clearfix" dataElementType="dDividerId" dataLayout="divider-style-1" dataWidgetVersion={2} id={1441211015}>
                                                                                                <hr className="dmDivider" style={{ borderWidth: '2px', borderTopStyle: 'solid', color: 'grey' }} id={1765315760} />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className=" dmform default native-inputs" dataElementType="dContactUsRespId" captcha="true" data-require-captcha="true" dataCaptchaPosition="bottomleft" id={1768185723}>
                                                                                    <h3 className="dmform-title dmwidget-title" id={1039053347} hide="true">
                                                                                        Website Lead</h3>
                                                                                    <div className="dmform-wrapper" style={{ margin: '0 auto' }} id={1899412683} captcha-lang="en">
                                                                                        <div className="dmRespDesignRow" locale="ENGLISH" id={1975886697} action>
                                                                                            <div className="dmforminput required  small-12 medium-12 large-12  dmRespDesignCol" id={1855700792}>
                                                                                                <label htmlFor="dmform-0" id={1990129566} className >Organization
                                                                                                    Name * </label>
                                                                                                <input onChange={handleClientDetailChange} value={clientDetails?.organizationName} name="organizationName" style={{ backgroundColor: '#f3f8fb' }} type="text" id={1723102561} placeholder="Organization" /><input type="hidden" name="label-dmform-0" defaultValue="Organization" id={1771422038} className />
                                                                                                <div style={{ color: '#cb3837', fontSize: 14 }}>{(isSubmitError && !clientDetails?.organizationName) && `Organization Name is required`}</div>
                                                                                            </div>
                                                                                            <div className="dmforminput small-12 medium-12 large-12 dmRespDesignCol" id={1319492863}>
                                                                                                <label htmlFor="dmform-4" id={1742203460}  >Organization
                                                                                                    Type * </label>
                                                                                                <input onChange={handleClientDetailChange} value={clientDetails?.organizationType} name="organizationType" style={{ backgroundColor: '#f3f8fb' }} type="text" id={1088939462} className placeholder="Organization Type" /><input type="hidden" name="label-dmform-4" defaultValue="Organization Type" id={1832609870} className />
                                                                                                <div style={{ color: '#cb3837', fontSize: 14 }}>{(isSubmitError && !clientDetails?.organizationType) && `Organization Type is required`}</div>
                                                                                            </div>
                                                                                            <div className="dmforminput small-12 medium-12 large-12 dmRespDesignCol" id={1481882184}>
                                                                                                <label htmlFor="dmform-5" id={1274719846}  >Organization
                                                                                                    Size * </label>
                                                                                                <input onChange={handleClientDetailChange} value={clientDetails?.organizationSize} name="organizationSize" style={{ backgroundColor: '#f3f8fb' }} type="text" id={1537238133} className placeholder="Organization Size" /><input type="hidden" name="label-dmform-5" defaultValue="Organization Size" id={1861703514} className />
                                                                                                <div style={{ color: '#cb3837', fontSize: 14 }}>{(isSubmitError && !clientDetails?.organizationSize) && `Organization Size is required`}</div>
                                                                                            </div>
                                                                                            <div className="dmforminput small-12 medium-12 large-12 dmRespDesignCol" id={1942857695}>
                                                                                                <label htmlFor="dmform-6" id={1691779908} >Website
                                                                                                    URL * </label>
                                                                                                <input onChange={handleClientDetailChange} value={clientDetails?.websiteUrl} name="websiteUrl" style={{ backgroundColor: '#f3f8fb' }} type="text" id={1509955001} className placeholder="Website URL" /><input type="hidden" name="label-dmform-6" defaultValue="Website URL" id={1504264415} className />
                                                                                                <div style={{ color: '#cb3837', fontSize: 14 }}>{(isSubmitError && !clientDetails?.websiteUrl) && `Website URL is required`}</div>
                                                                                            </div>
                                                                                            <div className="dmforminput required  small-12 medium-12 large-12  dmRespDesignCol" id={1724528442}>
                                                                                                <label htmlFor="dmform-1" id={1919837551}  >Full Name * </label>
                                                                                                <input onChange={handleClientDetailChange} value={clientDetails?.fullName} name="fullName" style={{ backgroundColor: '#f3f8fb' }} type="text" id={1717114357} placeholder="Full Name" /><input type="hidden" name="label-dmform-1" defaultValue="Full Name" id={1641355491} className />
                                                                                                <div style={{ color: '#cb3837', fontSize: 14 }}> {(isSubmitError && !clientDetails?.fullName) && `Full Name is required`}</div>
                                                                                            </div>

                                                                                            <div className="dmforminput required  small-12 medium-12 large-12  dmRespDesignCol" id={1724528442}>
                                                                                                <label htmlFor="dmform-1" id={1919837551} >Email * </label>
                                                                                                <input onChange={handleClientDetailChange} value={clientDetails?.clientEmail} name="clientEmail" style={{ backgroundColor: '#f3f8fb' }} type="text" id={1717114357} placeholder="Email" /><input type="hidden" name="label-dmform-1" defaultValue="Email" id={1641355491} className />
                                                                                                <div style={{ color: '#cb3837', fontSize: 14 }}>{(isSubmitError && !clientDetails?.clientEmail) && `Email is required`}</div>
                                                                                            </div>
                                                                                            <div className="dmforminput required  small-12 medium-12 large-12  dmRespDesignCol" id={1861108675}>
                                                                                                <label htmlFor="dmform-2" id={1937776670}  >Phone * </label>
                                                                                                <input onChange={handleClientDetailChange} value={clientDetails?.contactNo} name="contactNo" style={{ backgroundColor: '#f3f8fb' }} type="tel" id={1950306096} placeholder="Phone" /><input type="hidden" name="label-dmform-2" defaultValue="Phone" id={1071607214} className />
                                                                                                <div style={{ color: '#cb3837', fontSize: 14 }}>  {(isSubmitError && !clientDetails?.contactNo) && `Phone is required`}</div>
                                                                                            </div>

                                                                                            <span id={1383362560} className="dmWidgetClear" />
                                                                                            <br />
                                                                                            <div style={{ width: '100%', backgroundColor: 'rgb(248, 127, 5)' }} className="dmformsubmit dmWidget R" id={1333957374}>
                                                                                                <input onClick={handleSendDemoRequest} className name="submit" type="button" disabled={isSending} defaultValue={isSending ? 'PLEASE WAIT...' : 'SUBMIT'} id={1615523180} />
                                                                                            </div>
                                                                                            <input name="dmformsendto" type="hidden" defaultValue="O0wrseIfFLs4uosQ/6FDZrW0yEZdvRMuKcdcaddm0B3jZ7FqDnEw1jdymC3Zzixv" id={1444302410} className dataDec="true" /><input className="dmActionInput" type="hidden" name="action" defaultValue="/_dm/s/rt/widgets/dmform.submit.jsp" id={1954291531} /><input name="dmformsubject" type="hidden" defaultValue="New Website Lead for B Combs Website" id={1999833387} className dataEmailSubject="New Website Lead for B Combs Website" /><input name="dmformfrom" type="hidden" defaultValue="Fearless IT" id={1010666772} className />
                                                                                        </div>
                                                                                    </div>
                                                                                    <br /><br />
                                                                                    <div className="dmform-success" style={{ display: isSendSuccess ? 'block' : 'none', color: 'green', textAlign: 'center' }} id={1223061944}>Thank you
                                                                                        for contacting us.<br id={1354183160} />We
                                                                                        will get back to you as soon
                                                                                        as possible.</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div className=" dmRespRow fullBleedChanged fullBleedMode" id={1411664374}>
                                                                        <div className="dmRespColsWrapper" id={1651830202}>
                                                                            <div className="dmRespCol large-12 medium-12 small-12" id={1915196897}>
                                                                                <div dataElementType="spacer" className="dmSpacer u_1088118721" id={1088118721} />
                                                                            </div>
                                                                        </div>
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dmFooterContainer">
                                            {" "}
                                            <div
                                                id="fcontainer"
                                                className="f_hcontainer dmFooter p_hfcontainer"
                                                style={{ backgroundColor: '#212120' }}
                                            >
                                                {" "}
                                                <div
                                                    dmTemplateorder={250}
                                                    className="dmFooterResp generalFooter"
                                                    id={1943048428}
                                                    style={{ backgroundColor: '#212120' }}
                                                >
                                                    {" "}
                                                    <div
                                                        className="dmRespRow u_1780927130"
                                                        id={1780927130}
                                                    >
                                                        {" "}
                                                        <div className="dmRespColsWrapper" id={1995408805} style={{ color: "white" }}>
                                                            {" "}
                                                            <div
                                                                className="dmRespCol large-12 medium-12 small-12"
                                                                id={1487566622}
                                                            >
                                                                {" "}
                                                                <div
                                                                    className="u_1674804610 dmNewParagraph"
                                                                    data-element-type="paragraph"
                                                                    data-version={5}
                                                                    id={1674804610}
                                                                >
                                                                    {" "}
                                                                    <p className="text-align-center">
                                                                        {" "}
                                                                        <span
                                                                            style={{
                                                                                fontWeight: "bold",
                                                                                display: "unset",
                                                                                color: "white"
                                                                            }}
                                                                        >
                                                                            Software for those dedicated to making a
                                                                            better world.
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                                <div
                                                                    className="u_1450554520 imageWidget align-center"
                                                                    data-element-type="image"
                                                                    data-widget-type="image"
                                                                    id={1450554520}
                                                                >
                                                                    <img
                                                                        src={DesktopBcombsFooter}
                                                                        alt=""
                                                                        id={1653797752}
                                                                        className=""
                                                                        data-dm-image-path={DesktopBcombsFooter}
                                                                        width={614}
                                                                        height={161}
                                                                        onError="handleImageLoadError(this)"
                                                                    />
                                                                </div>
                                                                <div
                                                                    className="u_1131366087 dmNewParagraph"
                                                                    data-element-type="paragraph"
                                                                    data-version={5}
                                                                    id={1131366087}
                                                                    style={{
                                                                        transition: "none 0s ease 0s",
                                                                        textAlign: "left"
                                                                    }}
                                                                >
                                                                    {" "}
                                                                    <p className="text-align-left">
                                                                        {" "}
                                                                        <span
                                                                            style={{
                                                                                color: "white",
                                                                                display: "unset",
                                                                                fontWeight: "bold"
                                                                            }}
                                                                        >
                                                                            Email: nate@bcombs.com
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                                <div
                                                                    className="widget-1f5975 u_1933762263 dmCustomWidget"
                                                                    data-lazy-load=""
                                                                    data-title=""
                                                                    id={1933762263}
                                                                    dmle_extension="custom_extension"
                                                                    data-element-type="custom_extension"
                                                                    icon="false"
                                                                    surround="false"
                                                                    data-widget-id="1f5975986930429f819d4cd2154b5c4a"
                                                                    data-widget-version={22}
                                                                    data-widget-config="eyJjb3B5cmlnaHRUZXh0IjoiPHAgY2xhc3M9XCJydGVCbG9ja1wiPkFsbCBSaWdodHMgUmVzZXJ2ZWQgfCBCLmNvbWJzIHwgV2ViIERlc2lnbiBieSA8c3Ryb25nPjxhIHZhbHVlPVwiaHR0cHM6Ly93d3cuZmVhcmxlc3NpdC5jb20vXCIgbGFiZWw9XCJcIiB0eXBlPVwidXJsXCIgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cImh0dHBzOi8vd3d3LmZlYXJsZXNzaXQuY29tL1wiIGRhdGEtcnVudGltZS11cmw9XCJodHRwczovL3d3dy5mZWFybGVzc2l0LmNvbS9cIj5GZWFybGVzcyBJVDwvYT48L3N0cm9uZz48L3A+In0="
                                                                >
                                                                    {" "}
                                                                    <div className="copyright">
                                                                        {" "}
                                                                        <div style={{ color: 'white' }}>© 2022&nbsp;</div>
                                                                        <div>
                                                                            {" "}
                                                                            <p className="rteBlock" style={{ color: 'white' }}>
                                                                                All Rights Reserved | B.combs | Web
                                                                                Design by{" "}
                                                                                <strong>
                                                                                    {" "}
                                                                                    <a
                                                                                        value="https://www.fearlessit.com/"
                                                                                        label=""
                                                                                        type="url"
                                                                                        target="_blank"
                                                                                        href="https://www.fearlessit.com/"
                                                                                        data-runtime-url="https://www.fearlessit.com/"
                                                                                        raw_url="https://www.fearlessit.com/"
                                                                                    >
                                                                                        Fearless IT
                                                                                    </a>
                                                                                </strong>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    id={1236746004}
                                                    dmle_extension="powered_by"
                                                    data-element-type="powered_by"
                                                    icon="true"
                                                    surround="false"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div
                                        className="layout-drawer-hamburger hamburger-on-header"
                                        id="layout-drawer-hamburger"
                                        role="button"
                                        aria-label="menu opener"
                                        tabIndex={0}
                                        onClick={() => {
                                            setIsOpen(!isOpen)
                                        }}
                                    >
                                        {" "}
                                        <span className="hamburger__slice" />
                                        <span className="hamburger__slice" />
                                        <span className="hamburger__slice" />
                                    </div> */}
                                    {/* <a
                                        className="dmBackToTop"
                                        id="dmBackToTop"
                                        aria-label="Scroll to top"
                                        href="#dmContent"
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

};

export default MobilePage;