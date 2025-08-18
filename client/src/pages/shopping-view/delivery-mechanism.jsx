import { useState, useEffect } from 'react';
import PageWrapper from '@/components/common/page-wrapper';

export default function DeliveryPolicy() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.pageYOffset > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const goHome = () => {
        // You can implement navigation logic here based on your routing setup
        window.history.back(); // Simple back navigation
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const styles = {
        body: {
            fontFamily: "'Georgia', 'Times New Roman', serif",
            lineHeight: 1.6,
            color: '#333',
            backgroundColor: '#fafafa',
            margin: 0,
            padding: 0,
        },
        header: {
            background: 'linear-gradient(135deg, #DAA520, #F5DEB3)',
            color: '#8B4513',
            padding: '2rem 0',
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            position: 'relative',
        },
        headerH1: {
            fontSize: '2.5rem',
            marginBottom: '0.5rem',
            fontWeight: 300,
        },
        headerP: {
            fontSize: '1.1rem',
            opacity: 0.9,
        },
        container: {
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '0 20px',
        },
        content: {
            background: 'white',
            margin: '-50px auto 2rem',
            padding: '3rem',
            borderRadius: '15px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: 1,
        },
        lastUpdated: {
            background: '#FFF8DC',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            borderLeft: '4px solid #DAA520',
        },
        introText: {
            fontSize: '1.1rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #FFF8DC, #F5DEB3)',
            padding: '1.5rem',
            borderRadius: '10px',
            borderLeft: '4px solid #DAA520',
            textAlign: 'center',
        },
        tableOfContents: {
            background: '#f8f9fa',
            padding: '2rem',
            borderRadius: '10px',
            marginBottom: '2rem',
            border: '1px solid #e9ecef',
        },
        tocTitle: {
            color: '#B8860B',
            marginBottom: '1rem',
        },
        tocList: {
            listStyle: 'none',
            padding: 0,
        },
        tocItem: {
            marginBottom: '0.5rem',
        },
        tocLink: {
            color: '#495057',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'color 0.3s ease',
        },
        section: {
            marginBottom: '3rem',
        },
        sectionH2: {
            color: '#B8860B',
            fontSize: '1.8rem',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #DAA520',
        },
        sectionH3: {
            color: '#495057',
            fontSize: '1.3rem',
            marginTop: '1.5rem',
            marginBottom: '0.8rem',
        },
        sectionP: {
            marginBottom: '1rem',
            textAlign: 'justify',
        },
        sectionUl: {
            marginBottom: '1rem',
            paddingLeft: '2rem',
        },
        sectionLi: {
            marginBottom: '0.5rem',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '2rem',
            border: '2px solid #DAA520',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(218, 165, 32, 0.2)',
        },
        tableHeader: {
            background: 'linear-gradient(135deg, #DAA520, #B8860B)',
            color: 'white',
            fontWeight: 'bold',
        },
        tableHeaderCell: {
            padding: '1rem',
            textAlign: 'left',
            borderBottom: '2px solid #B8860B',
        },
        tableRow: {
            borderBottom: '1px solid #e9ecef',
        },
        tableRowAlt: {
            background: '#FFF8DC',
            borderBottom: '1px solid #e9ecef',
        },
        tableCell: {
            padding: '1rem',
            borderRight: '1px solid #e9ecef',
        },
        tableCellLast: {
            padding: '1rem',
        },
        locationHighlight: {
            fontWeight: 'bold',
            color: '#B8860B',
        },
        timelineCell: {
            fontWeight: '600',
            color: '#2d5016',
        },
        costCell: {
            fontWeight: 'bold',
            color: '#DAA520',
            fontSize: '1.1rem',
        },
        highlightBox: {
            background: 'linear-gradient(135deg, #FFF8DC, #F5DEB3)',
            padding: '1.5rem',
            borderRadius: '10px',
            borderLeft: '4px solid #DAA520',
            margin: '1.5rem 0',
        },
        warningBox: {
            background: 'linear-gradient(135deg, #FFF2E0, #FFE4B3)',
            padding: '1.5rem',
            borderRadius: '10px',
            borderLeft: '4px solid #FF8C00',
            margin: '1.5rem 0',
        },
        footer: {
            textAlign: 'center',
            padding: '2rem',
            color: '#6c757d',
            borderTop: '1px solid #e9ecef',
            marginTop: '2rem',
        },
        scrollTop: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#DAA520',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 1000,
            display: showScrollTop ? 'block' : 'none',
        },
        backHomeBtn: {
            position: 'fixed',
            top: '20px',
            left: '20px',
            background: 'linear-gradient(135deg, #DAA520, #F5DEB3)',
            color: '#8B4513',
            border: '2px solid #B8860B',
            borderRadius: '25px',
            padding: '12px 20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            zIndex: 9999,
            boxShadow: '0 4px 15px rgba(218, 165, 32, 0.3)',
            display: 'block',
            visibility: 'visible',
        },
    };

    return (
        <PageWrapper message="Loading delivery policy...">
        <>
         
            
            <div style={styles.body}>
                <div style={styles.header}>
                    <div style={styles.container}>
                        <h1 style={styles.headerH1}>Glowup Couture</h1>
                        <p style={styles.headerP}>Delivery Policy</p>
                    </div>
                </div>

                <div style={styles.container}>
                    <div style={styles.content}>
                        <div style={styles.lastUpdated}>
                            <strong>Last Updated:</strong> August 2025 | <strong>Headquarters:</strong> Kisumu, Kenya
                        </div>

                        <div style={styles.introText}>
                            At Glowup Couture, we are committed to getting your order to you as quickly as possible. The estimated delivery times and costs are based on our Kisumu headquarters, and include the time required for processing and shipping your order.
                        </div>

                        <div style={styles.tableOfContents}>
                            <h3 style={styles.tocTitle}>Quick Navigation</h3>
                            <ul style={styles.tocList}>
                                <li style={styles.tocItem}><span style={styles.tocLink} onClick={() => scrollToSection('shipping-kenya')} onMouseEnter={(e) => e.target.style.color = '#DAA520'} onMouseLeave={(e) => e.target.style.color = '#495057'}>Shipping within Kenya</span></li>
                                <li style={styles.tocItem}><span style={styles.tocLink} onClick={() => scrollToSection('important-notes')} onMouseEnter={(e) => e.target.style.color = '#DAA520'} onMouseLeave={(e) => e.target.style.color = '#495057'}>Important Notes</span></li>
                            </ul>
                        </div>

                        <div style={styles.section} id="shipping-kenya">
                            <h2 style={styles.sectionH2}>Shipping within Kenya</h2>
                            <p style={styles.sectionP}>Our delivery network covers all regions of Kenya, with priority given to areas closest to our Kisumu headquarters:</p>
                            
                            <table style={styles.table}>
                                <thead>
                                    <tr style={styles.tableHeader}>
                                        <th style={styles.tableHeaderCell}>Customer Location</th>
                                        <th style={styles.tableHeaderCell}>Timelines</th>
                                        <th style={styles.tableHeaderCell}>Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={styles.tableRow}>
                                        <td style={{...styles.tableCell, ...styles.locationHighlight}}>
                                            Kisumu & Kisumu Environs
                                        </td>
                                        <td style={{...styles.tableCell, ...styles.timelineCell}}>
                                            1-2 business days
                                        </td>
                                        <td style={{...styles.tableCellLast, ...styles.costCell}}>
                                            Ksh 220
                                        </td>
                                    </tr>
                                    <tr style={styles.tableRowAlt}>
                                        <td style={{...styles.tableCell, ...styles.locationHighlight}}>
                                            Other Major Towns in Nyanza & Western Kenya<br/>
                                            <small style={{color: '#6c757d', fontWeight: 'normal'}}>
                                                (e.g., Kisii, Kakamega, Bungoma, Busia)
                                            </small>
                                        </td>
                                        <td style={{...styles.tableCell, ...styles.timelineCell}}>
                                            2-3 business days
                                        </td>
                                        <td style={{...styles.tableCellLast, ...styles.costCell}}>
                                            Ksh 300
                                        </td>
                                    </tr>
                                    <tr style={styles.tableRow}>
                                        <td style={{...styles.tableCell, ...styles.locationHighlight}}>
                                            Nairobi & Nairobi Environs
                                        </td>
                                        <td style={{...styles.tableCell, ...styles.timelineCell}}>
                                            3-5 business days
                                        </td>
                                        <td style={{...styles.tableCellLast, ...styles.costCell}}>
                                            Ksh 400
                                        </td>
                                    </tr>
                                    <tr style={styles.tableRowAlt}>
                                        <td style={{...styles.tableCell, ...styles.locationHighlight}}>
                                            Other Towns across Kenya
                                        </td>
                                        <td style={{...styles.tableCell, ...styles.timelineCell}}>
                                            3-5 business days
                                        </td>
                                        <td style={{...styles.tableCellLast, ...styles.costCell}}>
                                            Ksh 500
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div style={styles.section} id="important-notes">
                            <h2 style={styles.sectionH2}>Important Notes</h2>
                            
                            <div style={styles.highlightBox}>
                                <h3 style={{color: '#B8860B', marginTop: 0}}>Order Processing</h3>
                                <p style={{marginBottom: 0}}>Orders are processed from our Kisumu fulfillment center Monday through Friday, excluding public holidays.</p>
                            </div>

                            <div style={styles.highlightBox}>
                                <h3 style={{color: '#B8860B', marginTop: 0}}>Delivery Tracking</h3>
                                <p style={{marginBottom: 0}}>Once your order is shipped, you will receive a tracking number via email or SMS to monitor its progress.</p>
                            </div>

                            <div style={styles.warningBox}>
                                <h3 style={{color: '#FF8C00', marginTop: 0}}>Unforeseen Delays</h3>
                                <p style={{marginBottom: 0}}>While we strive to meet the estimated timelines, delays may occur due to unforeseen circumstances, such as weather conditions or courier issues. We will do our best to keep you informed of any significant delays.</p>
                            </div>

                            <div style={styles.highlightBox}>
                                <h3 style={{color: '#B8860B', marginTop: 0}}>International Shipping</h3>
                                <p style={{marginBottom: 0}}>As of now, Glowup Couture operates exclusively within Kenya. We do not offer international shipping. Please check back for updates on future expansion.</p>
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, #E8F5E8, #D4F1D4)',
                            padding: '2rem',
                            borderRadius: '10px',
                            textAlign: 'center',
                            marginTop: '2rem',
                            border: '2px solid #90EE90'
                        }}>
                            <h3 style={{color: '#2d5016', marginBottom: '1rem'}}>Questions about Delivery?</h3>
                            <p style={{marginBottom: '1rem'}}>Our customer support team is here to help!</p>
                            <p><strong>Email:</strong> support@glowupcouture.com</p>
                            <p><strong>Phone:</strong> [Your Phone Number Here]</p>
                            <p style={{marginBottom: 0}}><strong>Hours:</strong> Monday to Friday, 8:00 AM - 5:00 PM</p>
                        </div>
                    </div>
                </div>

                <div style={styles.footer}>
                    <div style={styles.container}>
                        <p>&copy; 2025 Glowup Couture Limited. All rights reserved.</p>
                        <p>Headquartered in Kisumu, Kenya | Serving all of Kenya</p>
                    </div>
                </div>

                {showScrollTop && (
                    <button 
                        style={styles.scrollTop}
                        onClick={scrollToTop}
                        onMouseEnter={(e) => e.target.style.background = '#B8860B'}
                        onMouseLeave={(e) => e.target.style.background = '#DAA520'}
                    >
                        ↑
                    </button>
                )}
            </div>
        </>
        </PageWrapper>
    );
}