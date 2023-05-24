import React, { useRef, useState } from 'react';
import { Link } from '@reach/router';

import '../../../Style/desktop.css';
import './style.css';

import BcombsAppBlackText from '../../../Resources/images/BCombs-App-Black-text-1920w.png'
import AppMobile from '../../../Resources/images/BCombs-App-Mobile-1920w.png';
// import BcombsFinalLogo from '../../../Resources/images/BCombs_Final-Logo2-1920w.png';
// import PaperAndPen from '../../../Resources/images/Paper-and-pen-1920w.jpg';
// import Excel from "../../../Resources/images/Excel-1920w.jpg";
// import OnlineForm from '../../../Resources/images/Online-form-1920w.jpg';
// import BenefitsDelivered from '../../../Resources/images/Benefits-Delivered-1920w.png';
// import BcombsSiteIcon from '../../../Resources/images/BCombs_Site-icon-1920w.png';

import DesktopMetrics from '../../../Resources/images/desktop_bcombs_landing_img1.webp';
import DesktopBcombsApp from '../../../Resources/images/bcombs_app.webp'
import DesktopBcombsFooter from '../../../Resources/images/bcombs_footer_latest.webp'
import DesktopBcombsLatestMainBg from '../../../Resources/images/bcombs_latest_main_bg.webp'
import DesktopFocusOnWhatMattersBg from '../../../Resources/images/focus_on_what_matters_bg.webp';

const DesktopPage = props => {

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

    const handleClientDetailChange = e => {
        const { name, value } = e.target;
        setClientDetails({
            ...clientDetails,
            [name]: value
        });
    };

    const handleSendDemoRequest = async () => {
        try {
            console.log(';`${process.env.API_HOST}/api/demo_schedule/request`', `${process.env.API_HOST}/api/demo_schedule/request`)
            setIsSending(true);
            setIsSendSuccess(false);

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

    console.log('clientDetails', clientDetails)
    return <div style={{ height: 1000 }} id="dmRoot" dataPageAlias="home" className="supportsFontIcons supportsFontIcons dmRoot dmDesktopBody fix-mobile-scrolling addCanvasBorder dmResellerSite dmLargeBody responsiveTablet " style={{ padding: 0, margin: 0 }}>
        {/* ========= Site Content ========= */}
        <div id="dm" className="dmwr">
            <div className="dm_wrapper standard-var5 widgetStyle-3 standard">
                <div dmwrapped="true" id={1901957768} className="dm-home-page" themewaschanged="true">
                    <div dmtemplateid="StandardLayoutMultiD" className="standardHeaderLayout dm-bfs dm-layout-home hasAnimations rows-1200 dmPageBody d-page-1716942098 dmFreeHeader" id="dm-outer-wrapper" data-page-class={1716942098} data-buttonstyle="THICK_BORDER_ROUND" data-soch="true" data-background-parallax-selector=".dmHomeSection1, .dmSectionParallex">
                        <div id="dmStyle_outerContainer" className="dmOuter">
                            <div id="dmStyle_innerContainer" className="dmInner">
                                <div className="dmLayoutWrapper standard-var dmStandardDesktop">
                                    <div>
                                        <div id="iscrollBody">
                                            <div id="site_content">
                                                <div className="dmHeaderContainer fHeader d-header-wrapper">
                                                    <div id="hcontainer" className="dmHeader p_hfcontainer u_hcontainer" freeheader="true" headerlayout={725}>
                                                        <div className="dmHeaderResp dmHeaderStack noSwitch" id={1709005236}>
                                                            <div className="dmRespRow u_1192201191" id={1192201191}>
                                                                <div className="dmRespColsWrapper" id={1206067744}>
                                                                    {/* <div className="u_1865771293 dmRespCol small-12 large-5 medium-5" id={1865771293}>
                                                                        <div dataElementType="spacer" className="dmSpacer" id={1611415711} />
                                                                    </div> */}
                                                                    <div className="u_1012876683 dmRespCol small-12 large-5 medium-5" id={1012876683}>
                                                                        <div style={{ margin: '0 auto' }} className="u_1292964449 imageWidget align-center" dataElementType="image" dataWidgetType="image" id={1292964449}>
                                                                            <img src={BcombsAppBlackText} width={614} height={161} onerror="handleImageLoadError(this)" />
                                                                        </div>
                                                                    </div>
                                                                    {/* <div className="u_1044536395 dmRespCol small-12 large-7 medium-7" id={1044536395}> <a dataDisplayType="block" className="u_1395758421 align-center dmButtonLink dmWidget dmWwr default dmOnlyButton dmDefaultGradient" file="false" href="/login" dataElementType="dButtonLinkId" id={1395758421} data-buttonstyle="FLAT_ROUND_ICON" icon-name="icon-caret-right" raw_url="/home/" data-target-page-alias="home"> <span className="iconBg" aria-hidden="true" id={1401719004}> <span className="icon hasFontIconstar hasFontIcon icon-caret-right" id={1360238032} />
                                                                    </span>
                                                                        <span className="text" id={1650154059}>USER
                                                                            LOGIN</span>
                                                                    </a>
                                                                    </div> */}
                                                                    <div style={{ textAlign: 'right' }} className="u_1044536395 dmRespCol small-12 large-7 medium-7" id={1044536395}>


                                                                        <a href="/login" className=" align-center dmButtonLink dmWidget dmWwr default dmOnlyButton dmDefaultGradient" file="false" style={{ backgroundColor: '#fa7507', textAlign: 'center', margin: 0, paddingTop: 5, paddingBottom: 5, width: 200 }} >
                                                                            <span className="iconBg" aria-hidden="true" style={{ backgroundColor: 'black' }} id={1210537932}> <span className="icon hasFontIcon icon-star" id={1549847048} />
                                                                            </span>
                                                                            <span className="text" style={{ fontSize: 16 }} id={1255045965}>USER LOGIN</span>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="dmRespRow dmRespRowStable dmRespRowNoPadding dmPageTitleRow ">
                                                    <div className="dmRespColsWrapper">
                                                        <div className="large-12 dmRespCol">
                                                            <div id="innerBar" className="innerBar lineInnerBar dmDisplay_None">
                                                                <div className="titleLine display_None">
                                                                    <hr />
                                                                </div>
                                                                {/* Page title is hidden in css for new responsive sites. It is left here only so we don't break old sites. Don't copy it to new layouts */}
                                                                <div id="pageTitleText" />
                                                                <div className="titleLine display_None">
                                                                    <hr />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div dmwrapped="true" id={1901957768} className="dmBody u_dmStyle_template_home dm-home-page" themewaschanged="true">
                                                    <div id="allWrapper" className="allWrapper">
                                                        {/* navigation placeholders */}
                                                        <div id="dm_content" className="dmContent">
                                                            <div className="dmHomeRespTmpl mainBorder dmRespRowsWrapper dmFullRowRespTmpl" id={1716942098}>
                                                                <div className="u_1774361545 dmRespRow fullBleedChanged fullBleedMode" id={1774361545}>
                                                                    <div className="dmRespColsWrapper" id={1112975304}>
                                                                        <div className="dmRespCol small-12 medium-12 large-12 u_1414238043" id={1414238043}>
                                                                            <div className="dmRespRow u_1164260568 mobile-columns-reversed" id={1164260568}>
                                                                                <div className="dmRespColsWrapper" id={1596779468}>
                                                                                    <div className="u_1058420149 dmRespCol small-12 large-5 medium-5" id={1058420149}>
                                                                                        <div className="imageWidget align-center u_1915808864" dataElementType="image" dataWidgetType="image" id={1915808864} data-anim-desktop="none"><img src={AppMobile} alt="" id={1727884396} className dataDmImagePath="/Resources/images/BCombs-App-Mobile.png" width={450} height={674} onerror="handleImageLoadError(this)" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="u_1453347549 dmRespCol small-12 large-7 medium-7" id={1453347549}>
                                                                                        <div className="dmNewParagraph u_1787721266" dataElementType="paragraph" dataVersion={5} id={1787721266} style={{ transition: 'none 0s ease 0s', textAlign: 'left', display: 'block' }}>
                                                                                            <h1 className="m-text-align-center text-align-right" style={{ fontSize: 38, lineHeight: '1.2', textAlign: 'right', color: 'black' }}>
                                                                                                <div>WE HELP ORGANIZATIONS</div>
                                                                                                <div >THAT IMPACT YOUTH.</div>
                                                                                            </h1>
                                                                                            <h1 className="m-text-align-center text-align-right" style={{ lineHeight: '1.1', textAlign: 'right' }}>
                                                                                                <span style={{ display: 'initial' }}>SAVE
                                                                                                    TIME.</span>
                                                                                            </h1>
                                                                                            <h1 className="m-text-align-center text-align-right" style={{ lineHeight: '1.1', textAlign: 'right' }}>
                                                                                                <span style={{ display: 'initial' }}>REDUCE
                                                                                                    EFFORT.</span>
                                                                                            </h1>
                                                                                            <h1 className="m-text-align-center text-align-right" style={{ lineHeight: '1.1', textAlign: 'right' }}>
                                                                                                <span style={{ display: 'initial' }}>INCREASE
                                                                                                    IMPACT.</span>
                                                                                            </h1>

                                                                                            <div className="m-text-align-center text-align-right" style={{ lineHeight: '1.1', textAlign: 'right' }}>
                                                                                                <span style={{ textAlign: 'right', fontWeight: 'bolder' }}>Discover why non-profits use this software for efficient result management and</span>
                                                                                                <span style={{ textAlign: 'right', fontWeight: 'bolder' }}>presentation.</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        {/* <a onClick={() => demoScheduleRef.current.scrollIntoView()} dataDisplayType="block" className="u_1265853154 align-center dmButtonLink dmWidget dmWwr default dmOnlyButton dmDefaultGradient" file="false" dataElementType="dButtonLinkId" id={1265853154} raw_url="/home/"> <span className="iconBg" aria-hidden="true" id={1210537932}> <span className="icon hasFontIcon icon-star" id={1549847048} />
                                                                                        </span>
                                                                                            <span className="text" id={1255045965}>REQUEST A DEMO</span>
                                                                                        </a> */}

                                                                                        <div style={{ textAlign: 'right', width: '100%' }}>
                                                                                            <a onClick={(e) => {
                                                                                                e.preventDefault()
                                                                                                demoScheduleRef.current.scrollIntoView()
                                                                                            }}
                                                                                                dataDisplayType="block"
                                                                                                className=" align-right dmButtonLink dmWidget dmWwr default dmOnlyButton dmDefaultGradient"
                                                                                                style={{
                                                                                                    width: 210,
                                                                                                    paddingTop: 10,
                                                                                                    paddingBottom: 10
                                                                                                }}
                                                                                                file="false" href="./#Contact" dataElementType="dButtonLinkId" id={1632178657} raw_url="/home/"> <span className="iconBg" aria-hidden="true" id={1592183381}> <span className="icon hasFontIcon icon-star" id={1337130365} />
                                                                                                </span>
                                                                                                <span style={{
                                                                                                    fontSize: 17
                                                                                                }} className="text" id={1050213959}>REQUEST A DEMO</span>
                                                                                            </a>
                                                                                        </div>


                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <br />
                                                                <br />
                                                                <br />
                                                                <br />
                                                                <div className=" dmRespRow " id={1654014440} style={{ paddingLeft: 50, paddingRight: 50 }}>

                                                                    <div className="dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1408625624}>
                                                                        <h2 className="text-align-center" style={{ textAlign: 'center', color: 'black' }}>
                                                                            <span style={{ display: 'unset', color: 'black' }}>Get More Done With Less Effort</span>
                                                                        </h2>
                                                                        <div style={{ borderTop: '2px solid #FFC100', width: 77, margin: '0 auto' }}></div>
                                                                        <div style={{ marginLeft: 20, marginRight: 20 }} className="dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1953423639}>
                                                                            <p className="text-align-center"> <span style={{ display: 'unset', fontSize: 20 }}>As a youth mentoring organization, you must keep up with the ever-growing demand for your services while trying to manage limited resources. You and your team may also feel stretched thin trying to keep up with the data you need to renew grants.</span>
                                                                            </p>

                                                                            <p className="text-align-center"> <span style={{ display: 'unset', fontSize: 20 }}>Tracking and analyzing your organizational impact across different metrics can be challenging, especially if you're inputting information into multiple applications.</span>
                                                                            </p>

                                                                        </div>

                                                                        <div className=" dmNewParagraph" dataElementType="paragraph" style={{ marginTop: 12, marginLeft: 35, marginRight: 35 }}>

                                                                            <p className="text-align-center"> <div style={{ display: 'unset', fontSize: 24, color: 'black', fontWeight: 'bold' }}>
                                                                                With our software solution, you can easily compile and retain data to reduce the time and
                                                                            </div>
                                                                                <div style={{ display: 'unset', fontSize: 24, color: 'black', fontWeight: 'bold' }}>
                                                                                    energy spent entering information.
                                                                                </div>
                                                                            </p>


                                                                        </div>
                                                                        <div style={{ marginLeft: 20, marginRight: 20 }} className="dmRespCol small-12 medium-12 large-12 u_1414238043" id={1414238043}>
                                                                            <div className="dmRespRow mobile-columns-reversed" id={1164260568} style={{
                                                                                paddingLeft: 0,
                                                                                paddingRight: 0
                                                                            }}>
                                                                                <div className="dmRespColsWrapper" id={1596779468}>
                                                                                    <div className="u_1058420149 dmRespCol small-12 large-7 medium-7" id={1058420149}>
                                                                                        <div dataElementType="image" dataWidgetType="image" id={1915808864} data-anim-desktop="none"><img src={DesktopMetrics} alt="" dataDmImagePath="/Resources/images/desktop_bcombs_landing_img1.webp" width="650" height="auto" onerror="handleImageLoadError(this)" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="u_1453347549 dmRespCol small-12 large-5 medium-5" style={{ textAlign: 'justify', fontSize: 20 }} id={1453347549}>
                                                                                        Our streamlined alternative helps you simplify your operation’s informational input and analyze your organizational impact across metrics, giving you more time and energy to devote to the youth you serve.
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div style={{ textAlign: 'center', marginTop: 100 }} className="dmRespCol small-12 medium-12 large-12 u_1414238043" id={1414238043}>

                                                                            <a onClick={(e) => {
                                                                                e.preventDefault()
                                                                                demoScheduleRef.current.scrollIntoView()
                                                                            }}

                                                                                dataDisplayType="block" className=" align-center dmButtonLink dmWidget dmWwr default dmOnlyButton dmDefaultGradient" file="false" href="#" dataElementType="dButtonLinkId" style={{ backgroundColor: '#fa7507', textAlign: 'center', margin: 0, paddingTop: 10, paddingBottom: 10, width: 210 }} id={1265853154} raw_url="/home/"> <span className="iconBg" aria-hidden="true" style={{ backgroundColor: '#fa7507' }} id={1210537932}> <span className="icon hasFontIcon icon-star" id={1549847048} />
                                                                                </span>
                                                                                <span style={{
                                                                                    fontSize: 17
                                                                                }} className="text" id={1255045965}>REQUEST A DEMO</span>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div className="dmRespColsWrapper" id={1198015247}>
                                                                        <div className="dmRespCol large-12 medium-12 small-12" id={1673096564}>
                                                                            <div className="u_1171943110 graphicWidget" dataElementType="graphic" dataWidgetType="graphic" id={1171943110}>
                                                                                <svg version="1.1" id={1249875094} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="357.166px" height="299.854px" viewBox="0 0 357.166 299.854" enableBackground="new 0 0 357.166 299.854" xmlSpace="preserve" className="svg u_1249875094" dataIconCustom="true" dataIconName="quote copy.svg">
                                                                                    <g>
                                                                                        <path fillRule="evenodd" clipRule="evenodd" d="M0,299.841C0,199.585,0,99.888,0,0c53.874,0,107.573,0,161.847,0
          c0,1.147,0,2.333,0,3.52c0,55.37,0.022,110.74-0.096,166.11c-0.004,1.833-0.941,4.168-2.253,5.423
          c-42.9,41.035-85.896,81.97-128.906,122.891c-0.849,0.808-2.017,1.799-3.05,1.815C18.446,299.9,9.349,299.841,0,299.841z
           M23.985,270.953c1.295-1.138,2.065-1.769,2.784-2.454c36.386-34.649,72.782-69.289,109.085-104.025
          c1.152-1.102,1.904-3.201,1.908-4.838c0.102-44.123,0.083-88.246,0.072-132.369c0-1.078-0.133-2.157-0.201-3.167
          c-38.071,0-75.86,0-113.648,0C23.985,106.332,23.985,188.278,23.985,270.953z" />
                                                                                        <path fillRule="evenodd" clipRule="evenodd" d="M197.994,299.847c0-100.193,0-199.891,0-299.813c53.929,0,107.716,0,161.881,0
          c0,1.463,0,2.802,0,4.14c0,54.996-0.02,109.991,0.058,164.986c0.004,2.729-0.775,4.57-2.767,6.463
          c-42.863,40.712-85.649,81.505-128.485,122.246c-0.922,0.878-2.241,1.872-3.391,1.893
          C216.312,299.916,207.329,299.847,197.994,299.847z M222.012,270.953c1.294-1.138,2.065-1.769,2.785-2.453
          c36.386-34.649,72.781-69.29,109.085-104.026c1.152-1.102,1.905-3.201,1.908-4.837c0.102-44.123,0.083-88.247,0.073-132.369
          c-0.001-1.079-0.134-2.157-0.202-3.168c-38.07,0-75.859,0-113.649,0C222.012,106.332,222.012,188.277,222.012,270.953z">
                                                                                        </path>
                                                                                    </g>
                                                                                </svg>
                                                                            </div>
                                                                            <div className="dmNewParagraph u_1232693736" dataElementType="paragraph" dataVersion={5} id={1232693736} style={{ transition: 'none 0s ease 0s', textAlign: 'left', display: 'block' }}>
                                                                                <p className="text-align-center size-34 m-size-24">
                                                                                    <span className="font-size-34 m-font-size-24" style={{ fontStyle: 'italic', display: 'unset' }} m-font-size-set="true">“How
                                                                                        you gather, manage and use
                                                                                        information will determine whether
                                                                                        you win or lose.”</span>
                                                                                </p>
                                                                            </div>
                                                                            <div className="u_1946547886 dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1946547886}>
                                                                                <p className="text-align-center"> <span style={{ display: 'unset', fontWeight: 700, fontFamily: 'Comfortaa' }}>—
                                                                                    Bill Gates</span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div> */}
                                                                </div>
                                                                <div className="u_1774361545 dmRespRow fullBleedChanged fullBleedMode" id={1774361545}>
                                                                    <div className="dmRespColsWrapper" id={1027462133} style={{
                                                                        background: ` url("${DesktopFocusOnWhatMattersBg}")`,
                                                                        opacity: 1,

                                                                    }}>
                                                                        <div className="dmRespCol large-12 medium-12 small-12" id={1301741309}>
                                                                            <div style={{ paddingTop: 36 }} className="dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1408625624}>
                                                                                <div className="text-align-center" style={{ textAlign: 'center' }}> <h2 style={{ display: 'unset', color: 'white' }}>Focus on What Matters</h2>
                                                                                </div>
                                                                                <div className="text-align-center" style={{ textAlign: 'center' }}> <h3 style={{ display: 'unset', color: 'white' }}>The automation needed to enhance your mission</h3>
                                                                                </div>
                                                                            </div>

                                                                            <div className="dmRespRow u_1826450282" id={1826450282}>
                                                                                <div className="dmRespColsWrapper" id={1844629233}>
                                                                                    <div className="dmRespCol large-12 medium-12 small-12" id={1404997756}>
                                                                                        <div className="u_1819854624 dmDividerWrapper clearfix" dataElementType="dDividerId" dataLayout="divider-style-1" dataWidgetVersion={2} id={1819854624}>
                                                                                            <hr className="dmDivider" style={{ borderWidth: '2px', borderTopStyle: 'solid', color: 'grey' }} id={1486013173} />
                                                                                        </div>
                                                                                        <div className="u_1379829330 dmDividerWrapper clearfix" dataElementType="dDividerId" dataLayout="divider-style-1" dataWidgetVersion={2} id={1379829330}>
                                                                                            <hr className="dmDivider" style={{ borderWidth: '2px', borderTopStyle: 'solid', color: 'grey' }} id={1983256713} />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="dmRespRow u_1019446418" id={1019446418}>
                                                                                <div className="dmRespColsWrapper" id={1111480750}>
                                                                                    <div id={1047738323}>
                                                                                        <div className="dmRespRow " id={1440166053}>
                                                                                            <div className="dmRespColsWrapper" id={1701177513}>
                                                                                                <div className="u_1564374366 dmRespCol small-12 large-2 medium-2" id={1564374366}>
                                                                                                    <div className="graphicWidget u_1711906424" dataElementType="graphic" dataWidgetType="graphic" id={1711906424}>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="u_1093381198 dmRespCol small-12 large-10 medium-10" id={1093381198}>
                                                                                                    <ul>
                                                                                                        <li style={{ color: 'white', marginTop: 4, marginBottom: 4, fontSize: 20 }}>Track needed Metrics</li>

                                                                                                        <li style={{ color: 'white', marginTop: 4, marginBottom: 4, fontSize: 20 }}>User friendly design and experience</li>

                                                                                                        <li style={{ color: 'white', marginTop: 4, marginBottom: 4, fontSize: 20 }}>Aggregate data</li>

                                                                                                        <li style={{ color: 'white', marginTop: 4, marginBottom: 4, fontSize: 20 }}>Streamline communication</li>

                                                                                                        <li style={{ color: 'white', marginTop: 4, marginBottom: 4, fontSize: 20 }}>Automate process and Standardize data collection, across organization</li>

                                                                                                        <li style={{ color: 'white', marginTop: 4, marginBottom: 4, fontSize: 20 }}>Reduce effort and time needed to collect, analyze and store data</li>
                                                                                                    </ul>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div id={1047738323}>
                                                                                        <div className="dmRespRow " id={1440166053}>
                                                                                            <div className="dmRespColsWrapper" id={1701177513}>
                                                                                                <div className="u_1564374366 dmRespCol small-12 large-2 medium-2" id={1564374366}>
                                                                                                    <div className="graphicWidget u_1711906424" dataElementType="graphic" dataWidgetType="graphic" id={1711906424}>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="u_1093381198 dmRespCol small-12 large-12 medium-12" id={1093381198}>
                                                                                                    {/* <div style={{ margin: '0 auto' }} className="u_1292964449 imageWidget align-center" dataElementType="image" dataWidgetType="image" id={1292964449}> */}
                                                                                                    <img src={DesktopBcombsApp} style={{
                                                                                                        width: 'auto',
                                                                                                        height: 'auto'
                                                                                                    }} />
                                                                                                    {/* </div> */}
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

                                                                                    dataDisplayType="block" className=" align-center dmButtonLink dmWidget dmWwr default dmOnlyButton dmDefaultGradient" file="false" href="#" dataElementType="dButtonLinkId" style={{ backgroundColor: 'black', textAlign: 'center', margin: 0, paddingTop: 10, paddingBottom: 10, width: 210 }} id={1265853154} raw_url="/home/"> <span className="iconBg" aria-hidden="true" style={{ backgroundColor: '#fa7507' }} id={1210537932}> <span className="icon hasFontIcon icon-star" id={1549847048} />
                                                                                    </span>
                                                                                    <span style={{
                                                                                        fontSize: 17
                                                                                    }} className="text" id={1255045965}>REQUEST A DEMO</span>
                                                                                </a>
                                                                            </div>
                                                                            <br />
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
                                                                                                <div className="dmRespColsWrapper" id={1294397268}>
                                                                                                    <div style={{
                                                                                                        margin: 5,
                                                                                                        backgroundImage: 'linear-gradient(#FBA400, #fa7507)',
                                                                                                        borderRadius: 20
                                                                                                    }} className=" dmRespCol small-12 large-undefined medium-undefined medium-4 large-4" id="1073903950">
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
                                                                                                    }} className=" dmRespCol small-12 large-undefined medium-undefined medium-4 large-4" id="1073903950">
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
                                                                                                    }} className=" dmRespCol small-12 large-undefined medium-undefined medium-4 large-4" id="1073903950">
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

                                                                                                dataDisplayType="block" className=" align-center dmButtonLink dmWidget dmWwr default dmOnlyButton dmDefaultGradient" file="false" href="#" dataElementType="dButtonLinkId" style={{ backgroundColor: 'black', textAlign: 'center', margin: 0, paddingTop: 10, paddingBottom: 10, width: 210 }} id={1265853154} raw_url="/home/"> <span className="iconBg" aria-hidden="true" style={{ backgroundColor: '#fa7507' }} id={1210537932}> <span className="icon hasFontIcon icon-star" id={1549847048} />
                                                                                                </span>
                                                                                                <span style={{
                                                                                                    fontSize: 17
                                                                                                }} className="text" id={1255045965}>REQUEST A DEMO</span>
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



                                                                <div ref={demoScheduleRef} className=" dmRespRow fullBleedChanged fullBleedMode" id="schedule-demo" dataAnchor="schedule-demo">
                                                                    <div className="dmRespColsWrapper" id={1853815227}>
                                                                        <div className="dmRespCol small-12 medium-12 large-12  " id={1626947179}>
                                                                 
                                                                            <div className="dmRespRow u_1980259185 mobile-columns-reversed" >
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
                                                                                                    <span style={{ color: 'rgb(255, 255, 255)', display: 'unset', textAlign: 'center', color: 'black', fontSize: 24 }}>
                                                                                                        Request a demo below to find out more about how
                                                                                                    </span>
                                                                                                </div>
                                                                                                <div className="text-align-center" style={{ textAlign: 'center' }}>
                                                                                                    <span style={{ color: 'rgb(255, 255, 255)', display: 'unset', textAlign: 'center', color: 'black', fontSize: 24 }}>
                                                                                                        our award-winning b.combs can help your organization!
                                                                                                    </span>
                                                                                                </div>
                                                                                                <br />
                                                                                                <div style={{ borderTop: '2px solid #FFC100', width: 77, margin: '0 auto' }}></div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1574330505} style={{ transition: 'opacity 1s ease-in-out 0s' }}>
                                                                                            <p className="text-align-center">
                                                                                                <span style={{ display: 'unset', color: 'rgb(255, 255, 255)' }}>Please
                                                                                                    provide your information
                                                                                                    below and we will
                                                                                                    respond within 24 hours.
                                                                                                    Your information will be
                                                                                                    kept
                                                                                                    confidential.</span>
                                                                                            </p>
                                                                                        </div>
                                                                                        {/* <div className="dmRespRow u_1490776218" id={1490776218}>
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
                                                                                        </div> */}
                                                                                        <div className=" dmform default native-inputs" dataElementType="dContactUsRespId" captcha="true" data-require-captcha="true" dataCaptchaPosition="bottomleft" id={1768185723}>
                                                                                            <h3 className="dmform-title dmwidget-title" id={1039053347} hide="true">
                                                                                                Website Lead</h3>
                                                                                            <div className="dmform-wrapper" style={{ width: 600, margin: '0 auto' }} id={1899412683} captcha-lang="en">
                                                                                                <div method="post" className="dmRespDesignRow" locale="ENGLISH" id={1975886697} action>
                                                                                                    <div className="dmforminput required  small-12 medium-12 large-12  dmRespDesignCol" id={1855700792}>
                                                                                                        <label htmlFor="dmform-0" id={1990129566} className >Organization
                                                                                                            Name</label>
                                                                                                        <input onChange={handleClientDetailChange} value={clientDetails?.organizationName} name="organizationName" style={{ backgroundColor: '#f3f8fb' }} type="text" id={1723102561} placeholder="Organization" /><input type="hidden" name="label-dmform-0" defaultValue="Organization" id={1771422038} className />
                                                                                                    </div>
                                                                                                    <div className="dmforminput small-12 medium-12 large-12 dmRespDesignCol" id={1319492863}>
                                                                                                        <label htmlFor="dmform-4" id={1742203460}  >Organization
                                                                                                            Type</label>
                                                                                                        <input onChange={handleClientDetailChange} value={clientDetails?.organizationType} name="organizationType" style={{ backgroundColor: '#f3f8fb' }} type="text" id={1088939462} className placeholder="Organization Type" /><input type="hidden" name="label-dmform-4" defaultValue="Organization Type" id={1832609870} className />
                                                                                                    </div>
                                                                                                    <div className="dmforminput small-12 medium-12 large-12 dmRespDesignCol" id={1481882184}>
                                                                                                        <label htmlFor="dmform-5" id={1274719846}  >Organization
                                                                                                            Size</label>
                                                                                                        <input onChange={handleClientDetailChange} value={clientDetails?.organizationSize} name="organizationSize" style={{ backgroundColor: '#f3f8fb' }} type="text" id={1537238133} className placeholder="Organization Size" /><input type="hidden" name="label-dmform-5" defaultValue="Organization Size" id={1861703514} className />
                                                                                                    </div>
                                                                                                    <div className="dmforminput small-12 medium-12 large-12 dmRespDesignCol" id={1942857695}>
                                                                                                        <label htmlFor="dmform-6" id={1691779908} >Website
                                                                                                            URL</label>
                                                                                                        <input onChange={handleClientDetailChange} value={clientDetails?.websiteUrl} name="websiteUrl" style={{ backgroundColor: '#f3f8fb' }} type="text" id={1509955001} className placeholder="Website URL" /><input type="hidden" name="label-dmform-6" defaultValue="Website URL" id={1504264415} className />
                                                                                                    </div>
                                                                                                    <div className="dmforminput required  small-12 medium-12 large-12  dmRespDesignCol" id={1724528442}>
                                                                                                        <label htmlFor="dmform-1" id={1919837551}  >Full Name</label>
                                                                                                        <input onChange={handleClientDetailChange} value={clientDetails?.fullName} name="fullName" style={{ backgroundColor: '#f3f8fb' }} type="text" id={1717114357} placeholder="Full Name" /><input type="hidden" name="label-dmform-1" defaultValue="Full Name" id={1641355491} className />
                                                                                                    </div>

                                                                                                    <div className="dmforminput required  small-12 medium-12 large-12  dmRespDesignCol" id={1724528442}>
                                                                                                        <label htmlFor="dmform-1" id={1919837551} >Email</label>
                                                                                                        <input onChange={handleClientDetailChange} value={clientDetails?.clientEmail} name="clientEmail" style={{ backgroundColor: '#f3f8fb' }} type="text" id={1717114357} placeholder="Email" /><input type="hidden" name="label-dmform-1" defaultValue="Email" id={1641355491} className />
                                                                                                    </div>
                                                                                                    <div className="dmforminput required  small-12 medium-12 large-12  dmRespDesignCol" id={1861108675}>
                                                                                                        <label htmlFor="dmform-2" id={1937776670}  >Phone</label>
                                                                                                        <input onChange={handleClientDetailChange} value={clientDetails?.clientcontactNoEmail} name="contactNo" style={{ backgroundColor: '#f3f8fb' }} type="tel" id={1950306096} placeholder="Phone" /><input type="hidden" name="label-dmform-2" defaultValue="Phone" id={1071607214} className />
                                                                                                    </div>

                                                                                                    <span id={1383362560} className="dmWidgetClear" />
                                                                                                    <br />
                                                                                                    <div style={{ width: '100%', backgroundColor: 'rgb(248, 127, 5)' }} className="dmformsubmit dmWidget R" id={1333957374}>
                                                                                                        <input onClick={handleSendDemoRequest} className name="submit" type="button" disabled={isSending} defaultValue={isSending ? 'PLEASE WAIT...' : 'SUBMIT'} id={1615523180} />
                                                                                                    </div>
                                                                                                    <input name="dmformsendto" type="hidden" defaultValue="O0wrseIfFLs4uosQ/6FDZrW0yEZdvRMuKcdcaddm0B3jZ7FqDnEw1jdymC3Zzixv" id={1444302410} className dataDec="true" /><input className="dmActionInput" type="hidden" name="action" defaultValue="/_dm/s/rt/widgets/dmform.submit.jsp" id={1954291531} /><input name="dmformsubject" type="hidden" defaultValue="New Website Lead for B Combs Website" id={1999833387} className dataEmailSubject="New Website Lead for B Combs Website" /><input name="dmformfrom" type="hidden" defaultValue="Fearless IT" id={1010666772} className />

                                                                                                    <br /><br />
                                                                                                    <div className="dmform-success" style={{ display: isSendSuccess ? 'block' : 'none', color: 'green', textAlign: 'center' }} id={1223061944}>Thank you
                                                                                                        for contacting us.<br id={1354183160} />We
                                                                                                        will get back to you as soon
                                                                                                        as possible.</div>
                                                                                                </div>
                                                                                            </div>


                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className=" dmRespRow fullBleedChanged fullBleedMode" id={1411664374}>
                                                                                <div className="dmRespColsWrapper" id={1651830202}>
                                                                                    <div className="dmRespCol large-12 medium-12 small-12" id={1915196897}>
                                                                                        <div dataElementType="spacer" className="dmSpacer u_1088118721" id={1088118721} />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="dmFooterContainer">
                                                    <div id="fcontainer" className="f_hcontainer dmFooter p_hfcontainer" style={{ backgroundColor: '#212120' }}>
                                                        <div className="dmFooterResp generalFooter" id={1943048428} style={{ backgroundColor: '#212120' }}>
                                                            <div className="dmRespRow u_1780927130" id={1780927130}>
                                                                <div className="dmRespColsWrapper" id={1995408805}>
                                                                    <div className="dmRespCol large-12 medium-12 small-12" id={1487566622}>
                                                                        <div className="u_1674804610 dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1674804610}>
                                                                            <p className="text-align-center"> <span style={{ fontWeight: 'bold', display: 'unset', color: 'rgb(0, 0, 0)', color: 'white' }}>Software
                                                                                for those dedicated to making a better
                                                                                world.</span>
                                                                            </p>
                                                                        </div>
                                                                        <div className="u_1450554520 imageWidget align-center" dataElementType="image" dataWidgetType="image" id={1450554520}><img src={DesktopBcombsFooter} alt="" id={1653797752} className dataDmImagePath={BcombsAppBlackText} width={614} height={161} onerror="handleImageLoadError(this)" />
                                                                        </div>
                                                                        <div className="u_1131366087 dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1131366087} style={{ transition: 'none 0s ease 0s', textAlign: 'left' }}>
                                                                            <p className="text-align-left"> <span style={{ color: 'white', display: 'unset', fontWeight: 'bold' }}>Email:
                                                                                nate@bcombs.com</span>
                                                                            </p>
                                                                        </div>
                                                                        <div className="widget-1f5975 u_1933762263 dmCustomWidget" data-lazy-load data-title id={1933762263} dmle_extension="custom_extension" dataElementType="custom_extension" icon="false" surround="false" dataWidget-id="1f5975986930429f819d4cd2154b5c4a" dataWidgetVersion={22} dataWidgetConfig="eyJjb3B5cmlnaHRUZXh0IjoiPHAgY2xhc3M9XCJydGVCbG9ja1wiPkFsbCBSaWdodHMgUmVzZXJ2ZWQgfCBCLmNvbWJzIHwgV2ViIERlc2lnbiBieSA8c3Ryb25nPjxhIHZhbHVlPVwiaHR0cHM6Ly93d3cuZmVhcmxlc3NpdC5jb20vXCIgbGFiZWw9XCJcIiB0eXBlPVwidXJsXCIgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cImh0dHBzOi8vd3d3LmZlYXJsZXNzaXQuY29tL1wiIGRhdGEtcnVudGltZS11cmw9XCJodHRwczovL3d3dy5mZWFybGVzc2l0LmNvbS9cIj5GZWFybGVzcyBJVDwvYT48L3N0cm9uZz48L3A+In0=">
                                                                            <div className="copyright" style={{ color: 'white' }}>
                                                                                <div>© 2022&nbsp;</div>
                                                                                <div>
                                                                                    <p className="rteBlock">All Rights Reserved
                                                                                        | B.combs | Web Design by <strong>
                                                                                            <a value="https://www.fearlessit.com/" label type="url" target="_blank" href="https://www.fearlessit.com/" data-runtime-url="https://www.fearlessit.com/" raw_url="https://www.fearlessit.com/">Fearless
                                                                                                IT</a>
                                                                                        </strong></p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div id={1236746004} dmle_extension="powered_by" dataElementType="powered_by" icon="true" surround="false">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/*  Add full CSS and Javascript before the close tag of the body if needed */}
        {/* ========= JS Section ========= */}
        <div style={{ display: 'none' }} id="P6iryBW0Wu" />
        {/* photoswipe markup */}
        {/* Root element of PhotoSwipe. Must have class pswp. */}
        <div className="pswp" tabIndex={-1} role="dialog" aria-hidden="true">
            {/* Background of PhotoSwipe. 
     It's a separate element as animating opacity is faster than rgba(). */}
            <div className="pswp__bg" />
            {/* Slides wrapper with overflow:hidden. */}
            <div className="pswp__scroll-wrap">
                {/* Container that holds slides. 
        PhotoSwipe keeps only 3 of them in the DOM to save memory.
        Don't modify these 3 pswp__item elements, data is added later on. */}
                <div className="pswp__container">
                    <div className="pswp__item" />
                    <div className="pswp__item" />
                    <div className="pswp__item" />
                </div>
                {/* Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. */}
                <div className="pswp__ui pswp__ui--hidden">
                    <div className="pswp__top-bar">
                        {/*  Controls are self-explanatory. Order can be changed. */}
                        <div className="pswp__counter" />
                        <button className="pswp__button pswp__button--close" title="Close (Esc)" />
                        <button className="pswp__button pswp__button--share" title="Share" />
                        <button className="pswp__button pswp__button--fs" title="Toggle fullscreen" />
                        <button className="pswp__button pswp__button--zoom" title="Zoom in/out" />
                        {/* Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR */}
                        {/* element will get class pswp__preloader--active when preloader is running */}
                        <div className="pswp__preloader">
                            <div className="pswp__preloader__icn">
                                <div className="pswp__preloader__cut">
                                    <div className="pswp__preloader__donut" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                        <div className="pswp__share-tooltip" />
                    </div>
                    <button className="pswp__button pswp__button--arrow--left" title="Previous (arrow left)" />
                    <button className="pswp__button pswp__button--arrow--right" title="Next (arrow right)" />
                    <div className="pswp__caption">
                        <div className="pswp__caption__center" />
                    </div>
                </div>
            </div>
        </div>
        <div id="fb-root" data-locale="en" />
        {/* Alias: da53c60f */}
        <div className="dmPopupMask" id="dmPopupMask" />
        <div id="dmPopup" className="dmPopup">
            <div className="dmPopupCloseWrapper">
                <div className="dmPopupClose dm-common-icons-close oneIcon" onclick="dmHidePopup(event);" />
            </div>
            <div className="dmPopupTitle"> <span />
                Share by:</div>
            <div className="data" />
        </div>
    </div>

};


// const DemoForm = () => {

//     <div className=" dmRespRow fullBleedChanged fullBleedMode" id="schedule-demo" dataAnchor="schedule-demo">
//         <div className="dmRespColsWrapper" id={1853815227}>
//             <div className="dmRespCol small-12 medium-12 large-12  " id={1626947179}>

//                 <div className="dmRespRow u_1980259185 mobile-columns-reversed" >
//                     <div className="dmRespColsWrapper" id={1305498215}>
//                         <div className="u_1459125012 dmRespCol small-12 medium-12 large-12" id={1459125012}>
//                             <div className="dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1410395482}>
//                                 <div className="dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1134221766}>
//                                     <h2 className="text-align-center" style={{ textAlign: 'center' }}>
//                                         <span style={{ color: 'rgb(255, 255, 255)', display: 'unset', textAlign: 'center', color: 'black' }}>
//                                             Schedule a Demo
//                                         </span>
//                                     </h2>

//                                     <div className="text-align-center" style={{ textAlign: 'center' }}>
//                                         <span style={{ color: 'rgb(255, 255, 255)', display: 'unset', textAlign: 'center', color: 'black', fontSize: 24 }}>
//                                             Request a demo below to find out more about how
//                                         </span>
//                                     </div>
//                                     <div className="text-align-center" style={{ textAlign: 'center' }}>
//                                         <span style={{ color: 'rgb(255, 255, 255)', display: 'unset', textAlign: 'center', color: 'black', fontSize: 24 }}>
//                                             our award-winning b.combs can help your organization!
//                                         </span>
//                                     </div>
//                                     <br />
//                                     <div style={{ borderTop: '2px solid #FFC100', width: 77, margin: '0 auto' }}></div>
//                                 </div>
//                             </div>
//                             <div className="dmNewParagraph" dataElementType="paragraph" dataVersion={5} id={1574330505} style={{ transition: 'opacity 1s ease-in-out 0s' }}>
//                                 <p className="text-align-center">
//                                     <span style={{ display: 'unset', color: 'rgb(255, 255, 255)' }}>Please
//                                         provide your information
//                                         below and we will
//                                         respond within 24 hours.
//                                         Your information will be
//                                         kept
//                                         confidential.</span>
//                                 </p>
//                             </div>
//                             <div className="dmRespRow u_1490776218" id={1490776218}>
//                                 <div className="dmRespColsWrapper" id={1359750392}>
//                                     <div className="dmRespCol large-12 medium-12 small-12" id={1483143547}>
//                                         <div className="u_1949762416 dmDividerWrapper clearfix" dataElementType="dDividerId" dataLayout="divider-style-1" dataWidgetVersion={2} id={1949762416}>
//                                             <hr className="dmDivider" style={{ borderWidth: '2px', borderTopStyle: 'solid', color: 'grey' }} id={1096438539} />
//                                         </div>
//                                         <div className="u_1441211015 dmDividerWrapper clearfix" dataElementType="dDividerId" dataLayout="divider-style-1" dataWidgetVersion={2} id={1441211015}>
//                                             <hr className="dmDivider" style={{ borderWidth: '2px', borderTopStyle: 'solid', color: 'grey' }} id={1765315760} />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className=" dmform default native-inputs" dataElementType="dContactUsRespId" captcha="true" data-require-captcha="true" dataCaptchaPosition="bottomleft" id={1768185723}>
//                                 <h3 className="dmform-title dmwidget-title" id={1039053347} hide="true">
//                                     Website Lead</h3>
//                                 <div className="dmform-wrapper" style={{ width: 600, margin: '0 auto' }} id={1899412683} captcha-lang="en">
//                                     <form method="post" className="dmRespDesignRow" locale="ENGLISH" id={1975886697} action>
//                                         <div className="dmforminput required  small-12 medium-12 large-12  dmRespDesignCol" id={1855700792}>
//                                             <label htmlFor="dmform-0" id={1990129566} className >Organization
//                                                 Name</label>
//                                             <input style={{ backgroundColor: '#f3f8fb' }} type="text" name="dmform-0" id={1723102561} placeholder="Organization" /><input type="hidden" name="label-dmform-0" defaultValue="Organization" id={1771422038} className />
//                                         </div>
//                                         <div className="dmforminput small-12 medium-12 large-12 dmRespDesignCol" id={1319492863}>
//                                             <label htmlFor="dmform-4" id={1742203460}  >Organization
//                                                 Type</label>
//                                             <input style={{ backgroundColor: '#f3f8fb' }} type="text" name="dmform-4" id={1088939462} className placeholder="Organization Type" /><input type="hidden" name="label-dmform-4" defaultValue="Organization Type" id={1832609870} className />
//                                         </div>
//                                         <div className="dmforminput small-12 medium-12 large-12 dmRespDesignCol" id={1481882184}>
//                                             <label htmlFor="dmform-5" id={1274719846}  >Organization
//                                                 Size</label>
//                                             <input style={{ backgroundColor: '#f3f8fb' }} type="text" name="dmform-5" id={1537238133} className placeholder="Organization Size" /><input type="hidden" name="label-dmform-5" defaultValue="Organization Size" id={1861703514} className />
//                                         </div>
//                                         <div className="dmforminput small-12 medium-12 large-12 dmRespDesignCol" id={1942857695}>
//                                             <label htmlFor="dmform-6" id={1691779908} >Website
//                                                 URL</label>
//                                             <input style={{ backgroundColor: '#f3f8fb' }} type="text" name="dmform-6" id={1509955001} className placeholder="Website URL" /><input type="hidden" name="label-dmform-6" defaultValue="Website URL" id={1504264415} className />
//                                         </div>
//                                         <div className="dmforminput required  small-12 medium-12 large-12  dmRespDesignCol" id={1724528442}>
//                                             <label htmlFor="dmform-1" id={1919837551}  >Full Name</label>
//                                             <input style={{ backgroundColor: '#f3f8fb' }} type="text" className name="dmform-1" id={1717114357} placeholder="Full Name" /><input type="hidden" name="label-dmform-1" defaultValue="Full Name" id={1641355491} className />
//                                         </div>

//                                         <div className="dmforminput required  small-12 medium-12 large-12  dmRespDesignCol" id={1724528442}>
//                                             <label htmlFor="dmform-1" id={1919837551} >Email</label>
//                                             <input style={{ backgroundColor: '#f3f8fb' }} type="text" name="dmform-1" id={1717114357} placeholder="Email" /><input type="hidden" name="label-dmform-1" defaultValue="Email" id={1641355491} className />
//                                         </div>
//                                         <div className="dmforminput required  small-12 medium-12 large-12  dmRespDesignCol" id={1861108675}>
//                                             <label htmlFor="dmform-2" id={1937776670}  >Phone</label>
//                                             <input style={{ backgroundColor: '#f3f8fb' }} type="tel" name="dmform-2" id={1950306096} placeholder="Phone" /><input type="hidden" name="label-dmform-2" defaultValue="Phone" id={1071607214} className />
//                                         </div>

//                                         <span id={1383362560} className="dmWidgetClear" />
//                                         <br />
//                                         <div style={{ width: '100%', backgroundColor: 'rgb(248, 127, 5)' }} className="dmformsubmit dmWidget R" id={1333957374}>
//                                             <input className name="submit" type="submit" defaultValue="SUBMIT" id={1615523180} />
//                                         </div>
//                                         <input name="dmformsendto" type="hidden" defaultValue="O0wrseIfFLs4uosQ/6FDZrW0yEZdvRMuKcdcaddm0B3jZ7FqDnEw1jdymC3Zzixv" id={1444302410} className dataDec="true" /><input className="dmActionInput" type="hidden" name="action" defaultValue="/_dm/s/rt/widgets/dmform.submit.jsp" id={1954291531} /><input name="dmformsubject" type="hidden" defaultValue="New Website Lead for B Combs Website" id={1999833387} className dataEmailSubject="New Website Lead for B Combs Website" /><input name="dmformfrom" type="hidden" defaultValue="Fearless IT" id={1010666772} className />
//                                     </form>
//                                 </div>
//                                 <div className="dmform-success" style={{ display: 'none' }} id={1223061944}>Thank you
//                                     for contacting us.<br id={1354183160} />We
//                                     will get back to you as soon
//                                     as possible.</div>
//                                 <div className="dmform-error" style={{ display: 'none' }} id={1371327819}>Oops, there
//                                     was an error sending your
//                                     message.<br id={1068593025} />Please
//                                     try again later.</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className=" dmRespRow fullBleedChanged fullBleedMode" id={1411664374}>
//                     <div className="dmRespColsWrapper" id={1651830202}>
//                         <div className="dmRespCol large-12 medium-12 small-12" id={1915196897}>
//                             <div dataElementType="spacer" className="dmSpacer u_1088118721" id={1088118721} />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// }
export default DesktopPage;