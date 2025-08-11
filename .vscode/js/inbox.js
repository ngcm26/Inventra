// Inbox Page JavaScript - AI Powered Email Processing

document.addEventListener('DOMContentLoaded', function() {
    // Set inbox as active page for navbar
    localStorage.setItem('currentPage', 'inbox');
    
    // DOM Elements
    const emailListEl = document.getElementById('email-list');
    const emailViewerEl = document.getElementById('email-viewer');
    const searchInput = document.getElementById('search-input');
    
    // Mock data for emails (restore original dataset)
    const shared = Array.isArray(window.AppData?.inboxMessages) ? window.AppData.inboxMessages : null; // ignored
    const emails = (shared && false) ? shared.map(m => ({
        id: m.id,
        subject: m.subject,
        sender: m.email || (m.sender || 'noreply@example.com'),
        date: m.receivedAt,
        aiType: m.category,
        priority: m.isNew ? 'high' : 'normal',
        body: (m.snippet || '') + '\n\n(Full body not available in mock)'
    })) : [
        {
            id: 'email-schenker-001',
            subject: 'Custom Pallet Quote Request - Schenker Singapore',
            sender: 'orders@schenker.sg',
            date: '2024-01-14T09:00:00Z',
            aiType: 'quote',
            priority: 'normal',
            body: `Dear NGS Woodworks Team,

We hope this email finds you well. Schenker Singapore is seeking a comprehensive quote for custom wooden pallets to support our expanding logistics operations in Southeast Asia.

Project Requirements:
- Project Name: Schenker Custom Pallet Initiative 2024
- Timeline: Q2 2024 implementation
- Budget Range: SGD 50,000 - 75,000
- Delivery Location: Schenker Warehouse, 25 Pioneer Road North, Singapore

Pallet Specifications:
1. Standard Euro Pallets (1200x800mm)
   - Quantity: 1,000 pieces
   - Material: Heat-treated hardwood (ISPM-15 certified)
   - Load capacity: 2,500 kg dynamic, 6,000 kg static
   - Special requirements: Anti-slip surface treatment

2. Custom Heavy-Duty Pallets (1500x1200mm)
   - Quantity: 500 pieces
   - Material: Premium oak or similar hardwood
   - Load capacity: 3,500 kg dynamic, 8,000 kg static
   - Special features: Reinforced corner blocks, forklift accessibility from all sides

3. Specialized Chemical Storage Pallets (1200x1000mm)
   - Quantity: 200 pieces
   - Material: Chemically treated resistant wood
   - Compliance: UN standards for hazardous material storage
   - Features: Spill containment grooves, chemical-resistant coating

Quality Standards Required:
- All pallets must meet ISPM-15 international standards
- FSC or PEFC certification preferred for sustainability
- Quality inspection certificates required
- Comprehensive warranty coverage (minimum 24 months)

Additional Services Needed:
- On-site delivery with crane assistance
- Installation and setup guidance
- Training for our warehouse staff on proper handling
- Regular maintenance schedule recommendations
- Emergency replacement service availability

Commercial Terms:
- Payment: 30% advance, 70% on delivery
- Delivery: Staggered delivery over 8 weeks
- Pricing: Fixed price for entire project duration
- Penalties: Late delivery penalties as per standard terms

We would appreciate receiving your detailed quotation by January 20th, 2024, including:
1. Itemized pricing breakdown
2. Delivery schedule and logistics plan
3. Quality assurance documentation
4. References from similar projects
5. Environmental compliance certificates

For any clarifications or site visits, please contact our procurement manager, Ms. Sarah Chen, at sarah.chen@schenker.sg or +65-6234-5678.

We look forward to establishing a long-term partnership with Inventra for our pallet requirements across the region.

Best regards,
Procurement Department
Schenker Singapore Pte Ltd
Email: orders@schenker.sg
Phone: +65-6234-5678`
        },
        {
            id: 'email-kuehne-002',
            subject: 'Monthly Pallet Order - Kuehne + Nagel',
            sender: 'logistics@kn.com',
            date: '2024-01-13T11:30:00Z',
            aiType: 'order',
            priority: 'normal',
            body: `Dear NGS Woodworks Supply Team,

This is our standard monthly pallet procurement request for Kuehne + Nagel's Singapore operations for February 2024.

Monthly Order Details:
- Order Reference: KN-SG-2024-002
- Requested Delivery: February 1-5, 2024
- Total Order Value: Approximately SGD 28,500
- Payment Terms: Net 30 days as per existing agreement

Standard Pallet Requirements:
1. Euro Standard Pallets (1200x800x144mm)
   - Quantity: 800 pieces
   - Material: Heat-treated pine wood
   - Grade: New, first-quality
   - Marking: KN logo branded as per specifications
   - Unit Price: SGD 25.00 (as per contract KN-2024-PALLET-001)

2. Industrial Heavy-Duty Pallets (1200x1000x150mm)
   - Quantity: 300 pieces
   - Material: Hardwood construction
   - Load Rating: 2,000 kg dynamic load
   - Features: 4-way forklift entry, reinforced corners
   - Unit Price: SGD 35.00 (as per contract)

3. Specialty Cold Storage Pallets (1200x800x144mm)
   - Quantity: 150 pieces
   - Material: Moisture-resistant treated wood
   - Temperature Range: -25°C to +5°C operation
   - Special Coating: Food-grade protective finish
   - Unit Price: SGD 42.00 (as per contract)

Quality and Compliance:
- All pallets must comply with ISPM-15 standards
- Heat treatment certification required for each batch
- Quality inspection upon delivery as per SOP-KN-2024
- Defect tolerance: Maximum 2% as per service level agreement

Delivery Requirements:
- Location: Kuehne + Nagel Warehouse, 12 Tuas Avenue 1, Singapore 639503
- Delivery Window: 8:00 AM - 5:00 PM, Monday to Friday
- Contact Person: Mr. James Wong, Warehouse Manager (+65-6789-0123)
- Special Instructions: Pallets to be delivered in sets of 50, properly stacked and secured

Documentation Required:
- Delivery order with pallet count verification
- ISPM-15 heat treatment certificates
- Quality inspection report
- GST invoice (Company GST: 201234567M)

Additional Notes:
- This order is part of our annual framework agreement (Contract Ref: KN-2024-PALLET-001)
- Next month's forecast: Similar quantities expected
- Any delivery delays must be communicated 48 hours in advance
- Emergency contact for urgent matters: operations@kn.com

Please confirm receipt of this order and provide estimated delivery schedule by January 16th, 2024.

For any questions regarding specifications or delivery arrangements, please contact our logistics coordinator.

Thank you for your continued reliable service.

Best regards,
Logistics Procurement Team
Kuehne + Nagel (Singapore) Pte Ltd
Phone: +65-6789-0123
Email: logistics@kn.com`
        },
        {
            id: 'email-001',
            subject: 'RE: Shipment Update - Container MSKU7890123',
            sender: 'logistics@malaytimber.com',
            date: '2024-01-15T10:30:00Z',
            aiType: 'delay',
            priority: 'urgent',
            body: `Dear Partner,

We regret to inform you that your shipment of Malaysian hardwood pallets scheduled for delivery on August 5th has been delayed by 3 days due to unexpected port congestion at Port Klang.

Shipment Details:
- Container Number: MSKU7890123
- Original Contents: 500 pieces of Malaysian hardwood pallets (1200x800mm)
- Heat-treated and ISPM-15 certified for international shipping
- Original Delivery Date: August 5th, 2024
- Revised Delivery Date: August 8th, 2024
- Destination: Jurong Port, Singapore

Reason for Delay:
Port Klang is currently experiencing severe congestion due to a combination of factors including increased shipping volume post-holiday season and temporary closure of two berths for maintenance. The container vessel MV Ocean Star, carrying your shipment, is currently in queue position 15 and expected to dock on August 6th morning.

Mitigation Actions Taken:
1. We have expedited customs clearance procedures in advance
2. Priority berthing has been requested for urgent cargo
3. Additional trucking arrangements made for immediate transport post-arrival
4. Real-time tracking updates will be provided every 6 hours

Compensation:
As per our service agreement, we will waive the detention charges for the 3-day delay and provide a 5% discount on your next shipment booking. We understand this delay may impact your production schedule and sincerely apologize for any inconvenience caused.

Next Steps:
- We will notify you immediately once the vessel docks
- Customs clearance is pre-arranged to minimize additional delays
- Transport trucks are on standby for immediate pickup
- Quality inspection will be conducted upon arrival to ensure no damage during extended voyage

For any urgent requirements or alternative arrangements, please contact our emergency hotline at +60-3-8945-2200 (available 24/7).

Thank you for your understanding and continued partnership.

Best regards,
Malaysian Timber Logistics Team
Contact: +60-3-8945-2200
Email: logistics@malaytimber.com`
        },
        {
            id: 'email-002',
            subject: 'Container Arrival Notification - TEUS Container MSKU7890456',
            sender: 'psa@singaporeports.com',
            date: '2024-01-14T14:20:00Z',
            aiType: 'delivery',
            priority: 'normal',
            body: `Dear Valued Customer,

We are pleased to inform you that your container MSKU7890456 containing 500 oak pallets has successfully arrived at Tuas Port and is ready for collection.

Arrival Details:
- Container Number: MSKU7890456
- Vessel: MV Singapore Express
- Berth: Tuas Terminal 4, Berth 12
- Arrival Time: January 14, 2024 at 08:45 SGT
- Current Status: Customs cleared and ready for pickup

Cargo Information:
- Description: Oak wood pallets (premium grade)
- Quantity: 500 pieces
- Dimensions: 1200x1000mm standard Euro pallets
- Weight: Approximately 12.5 tons
- Special Handling: Heat-treated (ISPM-15 compliant)
- Packaging: Secured with steel strapping and moisture barriers

Customs and Documentation:
- Import permit: Approved (Ref: SGP-IMP-2024-001234)
- Phytosanitary certificate: Verified and cleared
- Bill of lading: Available for collection at our documentation center
- Insurance coverage: Active until final delivery

Collection Instructions:
1. Present this notification email and company authorization letter
2. Valid transport license and vehicle registration required
3. Container pickup window: 24/7 (advance booking recommended)
4. Estimated pickup time: 45 minutes including documentation
5. Special equipment: Standard container chassis required

Quality Assurance:
Our quality control team has conducted a preliminary inspection and confirms:
- No visible damage to container exterior
- Moisture levels within acceptable range
- Security seals intact and verified
- Documentation matches cargo manifest exactly

Charges Summary:
- Port handling charges: $450.00
- Documentation fees: $85.00
- Extended storage (if applicable): $25.00 per day after 5 free days
- Payment methods: Corporate account billing or cash/card at terminal

Important Notes:
- Free storage period expires on January 19, 2024
- After free period, storage charges apply at $25 per day
- Container must be returned within 7 days to avoid additional detention charges
- Any damages found during pickup must be reported immediately

For immediate collection arrangements, please contact our logistics coordinator at +65-6123-4567 or email dispatch@singaporeports.com

We appreciate your business and look forward to serving you again.

Best regards,
PSA Singapore Ports
Tuas Terminal Operations
Contact: +65-6123-4567`
        },
        {
            id: 'email-003',
            subject: 'Quality Control Report - Batch HW-MIX-QR01',
            sender: 'quality@indonesiawood.co.id',
            date: '2024-01-13T09:15:00Z',
            aiType: 'quality',
            priority: 'high',
            body: `Quality Assurance Department
Indonesia Wood Industries Ltd.

ATTENTION: Quality Control Alert

Dear Inventra Supply Chain Team,

Our quality inspection department has completed a comprehensive analysis of hardwood mix pallets from Batch HW-MIX-QR01 and identified several issues that require immediate attention and corrective action.

Batch Information:
- Batch Number: HW-MIX-QR01
- Production Date: January 8-10, 2024
- Total Quantity Produced: 850 pallets
- Wood Species: Mixed hardwood (Teak 40%, Mahogany 35%, Meranti 25%)
- Intended Use: Heavy-duty industrial applications
- Target Markets: Singapore, Malaysia, Thailand

Quality Issues Identified:

1. MOISTURE CONTENT DEVIATION (Critical)
   - Standard Requirement: 12-15%
   - Actual Measurements: 18.2% average (Range: 16.8% - 19.4%)
   - Impact: Increased risk of warping, cracking, and dimensional instability
   - Affected Units: Approximately 340 pallets (40% of batch)
   - Root Cause: Extended monsoon season affecting kiln-drying schedule

2. DIMENSIONAL ACCURACY (Moderate)
   - Standard Tolerance: ±2mm on all dimensions
   - Deviations Found: Up to ±4.5mm on width measurements
   - Affected Units: 85 pallets (10% of batch)
   - Impact: Potential compatibility issues with automated handling systems
   - Root Cause: Blade wear on primary sawing equipment

3. SURFACE FINISH QUALITY (Minor)
   - Standard: Smooth finish, grade A
   - Issues: Rough patches and tool marks on deck boards
   - Affected Units: 170 pallets (20% of batch)
   - Impact: Cosmetic concerns, potential snagging of goods
   - Root Cause: Insufficient sanding time due to production rush

Recommended Actions:

Immediate (Within 24 hours):
1. Quarantine all affected pallets pending further evaluation
2. Additional drying time for high-moisture content units (minimum 72 hours)
3. Re-machining of dimensionally non-compliant pallets
4. Secondary sanding operation for surface finish issues

Short-term (Within 1 week):
1. Calibration and maintenance of all sawing equipment
2. Review and adjustment of kiln-drying protocols
3. Enhanced quality control checkpoints during production
4. Staff retraining on dimensional accuracy standards

Long-term (Within 1 month):
1. Investment in moisture monitoring systems
2. Climate-controlled storage facility upgrades
3. Implementation of statistical process control
4. Supplier audit of raw material sources

Customer Impact Assessment:
Based on our analysis, we recommend:
- Immediate notification to affected customers
- Offer of replacement pallets for critical applications
- Extended warranty terms for delivered products
- Comprehensive quality certificate for compliant units

Next Steps:
1. Our remediation team will begin corrective actions immediately
2. Revised delivery schedule will be provided within 48 hours
3. Independent third-party quality verification arranged
4. Detailed corrective action plan to be submitted by January 20th

We sincerely apologize for any inconvenience this may cause and appreciate your understanding as we work to resolve these issues promptly. Our commitment to quality remains unwavering, and we are taking comprehensive measures to prevent similar occurrences.

For urgent queries or alternative arrangements, please contact:
- Quality Manager: Budi Santoso (+62-21-8765-4321)
- Production Director: Maria Sari (+62-21-8765-4322)
- Emergency Hotline: +62-21-8765-4300 (24/7)

Thank you for your continued partnership.

Sincerely,
Dr. Ahmad Rahman
Chief Quality Officer
Indonesia Wood Industries Ltd.`
        },
        {
            id: 'email-006',
            subject: 'Custom Pallet Quote Request - Schenker Singapore',
            sender: 'orders@schenker.sg',
            date: '2024-01-14T14:20:00Z',
            intent: 'Quote Request',
            body: `Hello,

We need a quote for custom pallets:

- Custom size: 1100x1100mm
- Quantity: 150 units
- Material: Oak wood
- ISPM-15 certification required
- Delivery: Tuas Port

Timeline: 2 weeks

Thank you,
Michael Wong
Schenker Singapore`
        },
        {
            id: 'email-007',
            subject: 'Monthly Pallet Order - Kuehne + Nagel',
            sender: 'logistics@kn.com',
            date: '2024-01-13T09:15:00Z',
            intent: 'Recurring Order',
            body: `Hi NGS Woodworks,

Monthly order for January:

1. Standard 1200x800mm pallets: 300 units
2. ISPM-15 certified pallets: 250 units
3. Heavy-duty containers: 50 units

Standard terms apply. Delivery to Changi warehouse.

Regards,
James Liu
Kuehne + Nagel`
        },
        {
            id: 'email-004',
            subject: 'Urgent Purchase Order - 1500 Custom Pallets Required',
            sender: 'procurement@globallogistics.sg',
            date: '2024-01-12T16:45:00Z',
            aiType: 'order',
            priority: 'urgent',
            body: `URGENT PROCUREMENT REQUEST
Global Logistics Singapore Pte Ltd
Purchase Order Department

Dear Inventra Supply Chain Team,

We have an immediate requirement for custom pallets for a major automotive client project. This is a time-sensitive order with strict delivery deadlines that require your urgent attention and expedited processing.

Project Overview:
Our client, a leading automotive manufacturer, is launching a new production line for electric vehicle battery components. The pallets will be used for transporting sensitive lithium-ion battery modules that require specialized handling and storage solutions.

Detailed Requirements:

1. CUSTOM PALLET SPECIFICATIONS:
   - Dimensions: 1100x1100mm (non-standard size for battery modules)
   - Load Capacity: Minimum 1500kg static load
   - Material: Premium grade Oak wood (Class A hardwood)
   - Thickness: Deck boards 25mm, stringer boards 40mm
   - Finish: Smooth surface, no protruding nails or splinters
   - Corner Protection: Reinforced corner brackets (stainless steel)

2. CERTIFICATION REQUIREMENTS:
   - ISPM-15 heat treatment certification for international shipping
   - FSC (Forest Stewardship Council) certification for sustainability
   - Automotive industry compliance (TS 16949 standards)
   - Anti-static treatment certification for electronic components
   - Load testing certificate for each batch (sample testing acceptable)

3. QUANTITY AND DELIVERY SCHEDULE:
   - Total Quantity: 1,500 pallets
   - Delivery Schedule:
     * Phase 1: 500 pallets by January 25th, 2024
     * Phase 2: 500 pallets by February 1st, 2024
     * Phase 3: 500 pallets by February 8th, 2024
   - Delivery Location: Global Logistics Warehouse, 45 Tuas South Ave 1
   - Delivery Time: Between 8:00 AM - 5:00 PM (advance notice required)

4. QUALITY CONTROL REQUIREMENTS:
   - Pre-delivery inspection by certified quality inspector
   - Moisture content must not exceed 15%
   - Dimensional tolerance: ±1mm on all measurements
   - Surface quality: No cracks, knots, or defects larger than 5mm
   - Each pallet must be individually wrapped for protection

5. SPECIAL HANDLING INSTRUCTIONS:
   - Pallets must be stored in climate-controlled environment
   - No exposure to direct sunlight or moisture during transport
   - Use of protective covering during loading/unloading
   - Gentle handling to prevent damage to corner reinforcements

Commercial Terms:
- Payment Terms: Net 30 days from delivery
- Pricing: Please provide competitive quote including delivery
- Insurance: Full coverage required during transport
- Warranty: 12 months against manufacturing defects
- Penalties: $50 per day per pallet for late delivery
- Quality Guarantee: 100% replacement for non-conforming products

Additional Information:
This order is part of a larger strategic partnership opportunity. Successful completion could lead to:
- Monthly recurring orders of 2,000-3,000 pallets
- Expansion to other automotive clients in the region
- Preferred supplier status for custom solutions
- Long-term contract negotiations (2-3 year terms)

Urgent Response Required:
Due to the tight timeline, we need your confirmation by January 15th, 2024, including:
1. Availability confirmation for the specified quantities and dates
2. Detailed quotation with itemized pricing
3. Production schedule and quality assurance plan
4. Delivery logistics and coordination details
5. References from similar automotive industry projects

Contact Information:
Primary Contact: Jennifer Wong, Senior Procurement Manager
Phone: +65-6789-1234 (Direct line)
Mobile: +65-9123-4567 (For urgent matters)
Email: j.wong@globallogistics.sg

Backup Contact: David Chen, Procurement Director
Phone: +65-6789-1235
Email: d.chen@globallogistics.sg

Please treat this inquiry with the highest priority and respond at your earliest convenience. We look forward to working with Inventra on this exciting project.

Best regards,
Jennifer Wong
Senior Procurement Manager
Global Logistics Singapore Pte Ltd`
        },
        {
            id: 'email-005',
            subject: 'Request for Quote - Monthly Pallet Supply Contract',
            sender: 'purchasing@asianshipping.com',
            date: '2024-01-11T11:20:00Z',
            aiType: 'quote',
            priority: 'normal',
            body: `Asian Shipping Solutions Ltd.
Purchasing Department
RFQ Reference: ASS-2024-PAL-001

Dear NGS Woodworks,

We are pleased to invite you to submit a comprehensive quotation for our annual pallet supply requirements. Asian Shipping Solutions is expanding our operations across Southeast Asia and requires a reliable supplier partner for standardized and custom pallet solutions.

Company Background:
Asian Shipping Solutions is a leading logistics provider serving over 200 international clients across maritime, air, and land transportation. Our operations span 15 countries with 45 distribution centers requiring consistent, high-quality pallet supplies for diverse cargo handling needs.

Annual Requirements Overview:

1. STANDARD EURO PALLETS (1200x800mm)
   - Monthly Quantity: 2,500 units
   - Annual Total: 30,000 units
   - Material: Mixed hardwood (acceptable species list attached)
   - Load Rating: 1500kg static, 1000kg dynamic
   - Certification: ISPM-15 heat treatment mandatory
   - Special Requirements: Four-way forklift entry, beveled edges

2. HEAVY-DUTY INDUSTRIAL PALLETS (1200x1000mm)
   - Monthly Quantity: 800 units
   - Annual Total: 9,600 units
   - Material: Premium hardwood (Oak, Teak, or equivalent)
   - Load Rating: 2500kg static, 1800kg dynamic
   - Construction: Double-deck design with reinforced stringers
   - Applications: Heavy machinery, steel products, automotive parts

3. CUSTOM EXPORT PALLETS (Various sizes)
   - Monthly Quantity: 300-500 units (varying dimensions)
   - Common Sizes: 1100x1100mm, 1067x1067mm, 1219x1016mm
   - Material: As per customer specifications
   - Certification: Multiple international standards (ISPM-15, FSC, etc.)
   - Lead Time: Maximum 14 days from order confirmation

4. SPECIALIZED PHARMACEUTICAL PALLETS
   - Monthly Quantity: 200 units
   - Dimensions: 800x600mm (Euro half-pallet)
   - Material: Kiln-dried hardwood, pharmaceutical grade
   - Special Treatment: Anti-bacterial coating, smooth surface finish
   - Certification: FDA compliance, pharmaceutical industry standards

Delivery Requirements:

Primary Locations:
1. Singapore Main Hub: 1500 pallets monthly
2. Malaysia Distribution Center: 1000 pallets monthly
3. Thailand Operations: 800 pallets monthly
4. Indonesia Facility: 700 pallets monthly
5. Philippines Warehouse: 500 pallets monthly

Delivery Schedule:
- Standard delivery: First Monday of each month
- Emergency orders: 48-hour response time required
- Advance notice: 14 days for quantity changes
- Flexible scheduling for holiday periods

Quality Standards:
- Moisture content: 12-18% (varies by destination climate)
- Dimensional tolerance: ±2mm on all measurements
- Surface quality: Smooth finish, no protruding fasteners
- Structural integrity: Load testing certificates required
- Packaging: Weather-resistant wrapping for sea transport

Commercial Terms Requested:

1. PRICING STRUCTURE:
   - Unit prices for each pallet type and quantity tier
   - Volume discount schedule for annual commitments
   - Price escalation formula tied to raw material costs
   - Currency: USD preferred, SGD acceptable
   - Price validity: Minimum 6 months

2. PAYMENT TERMS:
   - Standard terms: Net 45 days from delivery
   - Early payment discount: 2% if paid within 15 days
   - Monthly invoicing preferred
   - Electronic payment systems (wire transfer, SWIFT)

3. CONTRACT TERMS:
   - Initial contract duration: 24 months
   - Extension options: Two 12-month extensions
   - Minimum order guarantee: 80% of projected volumes
   - Force majeure provisions for supply disruptions

Additional Services Required:
- Quality inspection and certification
- Inventory management and forecasting
- Emergency supply capabilities
- Technical support for custom designs
- Sustainability reporting (carbon footprint, FSC compliance)
- Regular supplier performance reviews

Evaluation Criteria:
1. Competitive pricing (40%)
2. Quality and reliability track record (25%)
3. Delivery performance and flexibility (20%)
4. Technical capabilities and innovation (10%)
5. Sustainability and environmental practices (5%)

Submission Requirements:
Please provide the following by January 20th, 2024:

1. Detailed pricing matrix for all pallet types
2. Company profile and manufacturing capabilities
3. Quality certifications and compliance documents
4. References from similar-scale customers
5. Production capacity and scalability plans
6. Risk management and contingency procedures
7. Environmental and sustainability credentials

Submission Format:
- Electronic submission preferred (PDF format)
- Hard copy backup to be mailed if requested
- Presentation opportunity available for shortlisted suppliers
- Technical clarification meeting can be arranged

Contact Information:
RFQ Coordinator: Sarah Lim, Senior Purchasing Manager
Email: s.lim@asianshipping.com
Direct Phone: +65-6234-5678
Mobile: +65-9876-5432 (urgent matters only)

Technical Queries: Michael Tan, Quality Assurance Manager
Email: m.tan@asianshipping.com
Phone: +65-6234-5679

We look forward to establishing a long-term partnership with a supplier who shares our commitment to quality, reliability, and customer service excellence.

Thank you for your interest in this opportunity.

Sincerely,
Sarah Lim
Senior Purchasing Manager
Asian Shipping Solutions Ltd.`
        }
    ];
    
    let filteredEmails = [...emails];
    let selectedEmailId = null;
    
    // Initialize the inbox
    function initializeInbox() {
        renderEmailList();
        setupEventListeners();
        
        // Auto-open first email if coming with intent
        const urlParams = new URLSearchParams(window.location.search);
        const fromDashboardId = urlParams.get('msg');
        if (fromDashboardId) {
            const exists = emails.find(e => e.id === fromDashboardId);
            if (exists) {
                selectEmail(fromDashboardId);
                // Scroll selected into view after render
                setTimeout(() => {
                    const el = document.querySelector(`.email-item[data-id="${CSS.escape(fromDashboardId)}"]`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 150);
            }
        } else if (urlParams.get('intent') === 'import' && emails.length > 0) {
            selectEmail(emails[0].id);
        }
    }
    
    // Render email list
    function renderEmailList(emailsToRender = filteredEmails) {
        if (emailsToRender.length === 0) {
            emailListEl.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No emails found</h3>
                    <p>No emails match your search criteria.</p>
                </div>
            `;
            return;
        }
        
        emailListEl.innerHTML = '';
        emailsToRender.forEach((email, index) => {
            const emailItem = document.createElement('div');
            emailItem.className = 'email-item';
            emailItem.dataset.id = email.id;
            emailItem.dataset.index = index;
            
            // Ensure completely clean state
            emailItem.removeAttribute('style');
            
            // Add AI type class for border styling FIRST
            if (email.aiType) {
                emailItem.classList.add(email.aiType);
            }
            
            // Add selection state AFTER other classes (only one should ever be selected)
            if (email.id === selectedEmailId) {
                emailItem.classList.add('selected');
                console.log('Adding selected class to email:', email.id, 'Classes:', emailItem.className);
            }
            
            emailItem.innerHTML = `
                <div class="email-header">
                    <div class="email-info">
                        <div class="email-subject">${escapeHtml(email.subject)}</div>
                        <div class="email-sender">${escapeHtml(email.sender)}</div>
                    </div>
                    <div class="email-date">${formatDate(email.date)}</div>
                </div>
                <div class="email-meta">
                    <div class="email-tags">
                        <span class="ai-label ${email.aiType || 'info'}">
                            <i class="fas fa-${getAIIcon(email.aiType)}"></i>
                            ${getAILabel(email.aiType)}
                        </span>
                    </div>
                    <div class="email-priority">
                        ${email.priority || 'normal'}
                    </div>
                </div>
            `;
            
            // Enhanced click interaction
            emailItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Direct selection without additional animations
                selectEmail(email.id);
            });
            
            // Add keyboard navigation support
            emailItem.setAttribute('tabindex', '0');
            emailItem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectEmail(email.id);
                }
                // Arrow key navigation
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    navigateToEmail(index + 1);
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    navigateToEmail(index - 1);
                }
            });
            
            // Simple hover effects using CSS only
            // No JavaScript hover handlers needed - CSS :hover handles this
            
            emailListEl.appendChild(emailItem);
        });
        
        // Ensure proper scrolling behavior
        setupScrollBehavior();
    }
    
    // Select and display email
    function selectEmail(emailId) {
        const email = emails.find(e => e.id === emailId);
        if (!email) return;
        
        // Clear previous selection first
        selectedEmailId = null;
        
        // Force clear ALL selected states and styles
        document.querySelectorAll('.email-item').forEach(item => {
            item.classList.remove('selected', 'hover-state');
            // Clear all possible inline styles
            item.removeAttribute('style');
        });
        
        // Set new selection
        selectedEmailId = emailId;
        
        const selectedItem = document.querySelector(`[data-id="${emailId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
            
            // Force refresh the styling
            selectedItem.offsetHeight; // Trigger reflow
            
            // Smooth scroll to selected email if not fully visible
            scrollToEmail(selectedItem);
            
            console.log('Selected email:', emailId, 'Element found:', !!selectedItem, 'Classes:', selectedItem.className);
            
            // Debug: Check if selection style is applied
            setTimeout(() => {
                const computedStyle = window.getComputedStyle(selectedItem);
                console.log('Selected item background:', computedStyle.backgroundColor);
                console.log('Selected item border-left:', computedStyle.borderLeft);
            }, 100);
        } else {
            console.error('Could not find email element with ID:', emailId);
        }
        
        // Render email viewer with smooth transition
        emailViewerEl.style.opacity = '0.5';
        setTimeout(() => {
            // Generate toolbar with conditional buttons
            const toolbarHtml = generateEmailToolbar(email);
            
            emailViewerEl.innerHTML = `
                ${toolbarHtml}
                <div class="email-content-header">
                    <div class="email-title">${escapeHtml(email.subject)}</div>
                    <div class="email-details">
                        From: <strong>${escapeHtml(email.sender)}</strong> • 
                        <span>${formatDateTime(email.date)}</span>
                    </div>
                </div>
                <div class="email-body">${escapeHtml(email.body)}</div>
            `;
            
            emailViewerEl.style.opacity = '1';
            
            // Bind action buttons
            setupEmailActions(email);
        }, 150);
    }
    
    // Generate email toolbar with conditional buttons
    function generateEmailToolbar(email) {
        const isOrderRelated = ['order', 'quote'].includes(email.aiType);
        
        let toolbarButtons = `
            <button id="extract-btn" class="btn">
                <i class="fas fa-wand-magic-sparkles"></i>
                Extract with AI
            </button>
        `;
        
        if (isOrderRelated) {
            const buttonText = email.aiType === 'order' ? 'Create Order from Email' : 'Generate Quote Response';
            const buttonIcon = email.aiType === 'order' ? 'fa-download' : 'fa-file-invoice';
            
            toolbarButtons += `
                <button id="import-btn" class="btn btn-primary">
                    <i class="fas ${buttonIcon}"></i>
                    ${buttonText}
                </button>
            `;
        }
        
        return `<div class="email-toolbar">${toolbarButtons}</div>`;
    }
    
    // Navigate to email by index (for keyboard navigation)
    function navigateToEmail(index) {
        if (index < 0 || index >= filteredEmails.length) return;
        
        const email = filteredEmails[index];
        if (email) {
            selectEmail(email.id);
        }
    }
    
    // Scroll to ensure email is visible
    function scrollToEmail(emailElement) {
        if (!emailElement) return;
        
        const container = emailListEl;
        const containerRect = container.getBoundingClientRect();
        const elementRect = emailElement.getBoundingClientRect();
        
        // Check if email is fully visible
        const isFullyVisible = (
            elementRect.top >= containerRect.top &&
            elementRect.bottom <= containerRect.bottom
        );
        
        if (!isFullyVisible) {
            // Smooth scroll to center the email
            const scrollTop = container.scrollTop;
            const elementTop = emailElement.offsetTop;
            const containerHeight = container.clientHeight;
            const elementHeight = emailElement.offsetHeight;
            
            const targetScroll = elementTop - (containerHeight / 2) + (elementHeight / 2);
            
            container.scrollTo({
                top: Math.max(0, targetScroll),
                behavior: 'smooth'
            });
        }
    }
    
    // Setup scroll behavior to prevent cutoff
    function setupScrollBehavior() {
        const container = emailListEl;
        
        // Add smooth scrolling behavior
        container.style.scrollBehavior = 'smooth';
        
        // Add padding observer to detect last email visibility
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Last email is visible, ensure proper spacing
                    const lastEmail = container.lastElementChild;
                    if (lastEmail && lastEmail.classList.contains('email-item')) {
                        lastEmail.style.marginBottom = '20px';
                    }
                }
            });
        }, {
            root: container,
            threshold: 1.0
        });
        
        // Observe the last email
        const lastEmail = container.lastElementChild;
        if (lastEmail) {
            observer.observe(lastEmail);
        }
        
        // Add scroll event listener for smooth interactions
        container.addEventListener('scroll', debounce(() => {
            // Update any scroll-dependent UI elements
            const scrollPercentage = (container.scrollTop / (container.scrollHeight - container.clientHeight)) * 100;
            
            // You can add scroll indicators or other UI feedback here
            if (scrollPercentage > 90) {
                // Near bottom - ensure last email has proper spacing
                const lastEmail = container.lastElementChild;
                if (lastEmail && lastEmail.classList.contains('email-item')) {
                    lastEmail.style.marginBottom = '24px';
                }
            }
        }, 100));
    }
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Setup email action buttons
    function setupEmailActions(email) {
        const extractBtn = document.getElementById('extract-btn');
        const importBtn = document.getElementById('import-btn');
        
        if (extractBtn) {
            extractBtn.addEventListener('click', () => handleExtractWithAI(email));
        }
        
        if (importBtn) {
            // Handle different button actions based on email type
            if (email.aiType === 'order') {
                importBtn.addEventListener('click', () => handleCreateOrder(email));
            } else if (email.aiType === 'quote') {
                importBtn.addEventListener('click', () => handleGenerateQuote(email));
            }
        }
    }
    
    // Handle AI extraction with enhanced analysis display
    function handleExtractWithAI(email) {
        const extractBtn = document.getElementById('extract-btn');
        const originalText = extractBtn.innerHTML;
        
        // Show loading state
        extractBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI Processing...';
        extractBtn.disabled = true;
        
        // Simulate AI processing
        setTimeout(() => {
            const parsedOrder = parseEmailToOrder(email);
            
            // Display AI analysis results
            displayAIAnalysis(parsedOrder.aiAnalysis, parsedOrder.items);
            
            // Store for later use
            sessionStorage.setItem('inventra.pendingOrder', JSON.stringify(parsedOrder));
            
            // Reset button
            extractBtn.innerHTML = originalText;
            extractBtn.disabled = false;
            
        }, 3000);
    }
    
    // Display AI analysis results
    function displayAIAnalysis(analysis, items) {
        const analysisModal = document.createElement('div');
        analysisModal.className = 'analysis-modal';
        analysisModal.innerHTML = `
            <div class="analysis-content">
                <div class="analysis-header">
                    <h3><i class="fas fa-robot"></i> AI Analysis Results</h3>
                    <button class="close-analysis">&times;</button>
                </div>
                <div class="analysis-body">
                    <div class="analysis-section">
                        <h4>Priority Classification</h4>
                        <div class="priority-badge priority-${analysis.priority.toLowerCase()}">
                            ${analysis.priority}
                        </div>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>Category</h4>
                        <div class="category-badge">${analysis.category}</div>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>Key Information Extracted</h4>
                        <ul class="key-points">
                            ${analysis.keyPoints.map(point => `<li><i class="fas fa-check-circle"></i> ${point}</li>`).join('')}
                        </ul>
                    </div>
                    
                    ${items.length > 0 ? `
                    <div class="analysis-section">
                        <h4>Detected Items</h4>
                        <div class="detected-items">
                            ${items.map(item => `
                                <div class="item-card">
                                    <div class="item-name">${item.name}</div>
                                    <div class="item-details">
                                        <span>Qty: ${item.quantity}</span>
                                        <span>Material: ${item.specifications?.material || 'Standard'}</span>
                                        <span>Price: $${item.unitPrice || 45}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="analysis-section">
                        <h4>Recommended Action</h4>
                        <div class="action-recommendation">
                            <i class="fas fa-lightbulb"></i>
                            ${analysis.actionRequired}
                        </div>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>Impact Assessment</h4>
                        <div class="impact-assessment">
                            ${analysis.impactAssessment}
                        </div>
                    </div>
                </div>
                <div class="analysis-actions">
                    <button class="btn btn-secondary close-analysis">Close Analysis</button>
                    <button class="btn btn-primary" onclick="proceedToOrderCreation()">Create Order</button>
                </div>
            </div>
        `;
        
        // Add modal styles
        if (!document.querySelector('#analysis-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'analysis-modal-styles';
            styles.textContent = `
                .analysis-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    backdrop-filter: blur(4px);
                }
                .analysis-content {
                    background: white;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }
                .analysis-header {
                    padding: 24px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                }
                .analysis-header h3 {
                    margin: 0;
                    color: #1e293b;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .close-analysis {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #64748b;
                    padding: 4px;
                }
                .analysis-body {
                    padding: 24px;
                }
                .analysis-section {
                    margin-bottom: 24px;
                }
                .analysis-section h4 {
                    margin: 0 0 12px 0;
                    color: #374151;
                    font-size: 14px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .priority-badge {
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-weight: 700;
                    text-align: center;
                    width: fit-content;
                }
                .priority-high { background: #fee2e2; color: #dc2626; }
                .priority-medium { background: #fef3c7; color: #d97706; }
                .priority-urgent { background: #fecaca; color: #b91c1c; }
                .priority-normal { background: #e0f2fe; color: #0369a1; }
                .priority-low { background: #f1f5f9; color: #64748b; }
                .category-badge {
                    background: linear-gradient(135deg, #3F7AB0 0%, #2563eb 100%);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-weight: 600;
                    width: fit-content;
                }
                .key-points {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .key-points li {
                    padding: 8px 0;
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    border-bottom: 1px solid #f1f5f9;
                }
                .key-points li:last-child {
                    border-bottom: none;
                }
                .key-points i {
                    color: #10b981;
                    margin-top: 2px;
                }
                .detected-items {
                    display: grid;
                    gap: 12px;
                }
                .item-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 12px;
                }
                .item-name {
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 4px;
                }
                .item-details {
                    display: flex;
                    gap: 12px;
                    font-size: 12px;
                    color: #64748b;
                }
                .action-recommendation {
                    background: #eff6ff;
                    border: 1px solid #bfdbfe;
                    border-radius: 8px;
                    padding: 12px;
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    color: #1e40af;
                }
                .impact-assessment {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    border-radius: 8px;
                    padding: 12px;
                    color: #166534;
                }
                .analysis-actions {
                    padding: 20px 24px;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(analysisModal);
        
        // Close modal functionality
        const closeButtons = analysisModal.querySelectorAll('.close-analysis');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                analysisModal.remove();
            });
        });
        
        // Close on backdrop click
        analysisModal.addEventListener('click', (e) => {
            if (e.target === analysisModal) {
                analysisModal.remove();
            }
        });
        
        // Show success notification
        showNotification('AI analysis complete! Review extracted information.', 'success');
    }
    
    // Proceed to order creation from analysis
    window.proceedToOrderCreation = function() {
        document.querySelector('.analysis-modal')?.remove();
        showNotification('Redirecting to order creation...', 'info');
        setTimeout(() => {
            window.location.href = 'create-order.html#prefilled';
        }, 1000);
    };
    
    // Handle direct order creation
    function handleCreateOrder(email) {
        // Parse email to order draft and redirect to Create Order with prefill
        const orderDraft = parseEmailToOrder(email);
        sessionStorage.setItem('inventra.pendingOrder', JSON.stringify(orderDraft));
        showNotification('Opening Create Order with details prefilled...', 'info');
        setTimeout(() => {
            window.location.href = 'create-order.html#prefilled';
        }, 400);
    }
    
    // Handle quote generation from email
    function handleGenerateQuote(email) {
        const importBtn = document.getElementById('import-btn');
        const originalText = importBtn.innerHTML;
        
        // Show loading state
        importBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Quote...';
        importBtn.disabled = true;
        
        // Simulate quote generation process
        setTimeout(() => {
            const quoteData = parseEmailToQuote(email);
            
            // In a real app, this would call an API to generate quote
            const quoteRef = 'QTE-' + Date.now().toString().slice(-6);
            quoteData.reference = quoteRef;
            
            // Show success notification
            showNotification(`Quote ${quoteRef} generated and saved to drafts!`, 'success');
            
            // Reset button
            importBtn.innerHTML = originalText;
            importBtn.disabled = false;
            
            // Optional: Show quote details in a modal or redirect
            console.log('Generated Quote:', quoteData);
        }, 2500);
    }
    
    // Parse email content to extract quote requirements
    function parseEmailToQuote(email) {
        const body = email.body;
        const quoteData = {
            customerEmail: email.sender,
            subject: email.subject,
            requestDate: email.date,
            items: [],
            requirements: {},
            timeline: null,
            budget: null
        };
        
        // Extract budget information
        const budgetMatch = body.match(/budget.*?(?:sgd|s\$|\$)\s*([\d,]+)(?:\s*-\s*(?:sgd|s\$|\$)?\s*([\d,]+))?/i);
        if (budgetMatch) {
            const min = parseInt(budgetMatch[1].replace(/,/g, ''));
            const max = budgetMatch[2] ? parseInt(budgetMatch[2].replace(/,/g, '')) : null;
            quoteData.budget = max ? `SGD ${min.toLocaleString()} - ${max.toLocaleString()}` : `SGD ${min.toLocaleString()}`;
        }
        
        // Extract timeline information
        const timelineMatch = body.match(/timeline.*?(\w+\s+\d{4})|delivery.*?(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i);
        if (timelineMatch) {
            quoteData.timeline = timelineMatch[1] || timelineMatch[2];
        }
        
        // Extract pallet specifications
        const palletMatches = body.match(/(\d+)\s+pieces.*?(\d+x\d+mm)/gi);
        if (palletMatches) {
            palletMatches.forEach(match => {
                const qty = match.match(/(\d+)\s+pieces/i);
                const dims = match.match(/(\d+x\d+mm)/i);
                if (qty && dims) {
                    quoteData.items.push({
                        type: 'Custom Pallet',
                        quantity: parseInt(qty[1]),
                        dimensions: dims[1],
                        specifications: 'As per customer requirements'
                    });
                }
            });
        }
        
        return quoteData;
    }
    
    // Parse email content to extract order information with AI analysis
    function parseEmailToOrder(email) {
        const originalBody = email.body;
        const body = originalBody.toLowerCase();
        let items = [];
        let aiAnalysis = {};
        
        // Try parsing structured enumerated items first (e.g., "1. Euro Standard Pallets (1200x800x144mm)" then "- Quantity: 800 pieces")
        const structuredItems = parseStructuredOrderItems(originalBody);
        if (structuredItems.length > 0) {
            items = structuredItems;
        }

        // Enhanced AI pattern recognition (fallback when structured parsing finds nothing)
        const palletPatterns = [
            /(?:euro\s+pallets?|standard\s+pallets?).*?(\d+)\s*x\s*(\d+)\s*mm.*?(\d+)\s+(?:units?|pieces?|pallets?)/gi,
            /custom.*?(\d+)\s*x\s*(\d+)\s*mm.*?(\d+)\s+(?:units?|pieces?|pallets?)/gi,
            /(?:dimensions?|size).*?(\d+)\s*x\s*(\d+)\s*mm.*?(?:quantity|total).*?(\d+)/gi,
            /(\d+)\s+(?:units?|pieces?).*?(\d+)\s*x\s*(\d+)\s*mm/gi
        ];
        
        if (items.length === 0) {
            // Extract quantities and specifications
            palletPatterns.forEach(pattern => {
                let match;
                while ((match = pattern.exec(body)) !== null) {
                    const quantity = parseInt(match[3]) || parseInt(match[1]);
                    const width = parseInt(match[1]) || parseInt(match[2]);
                    const length = parseInt(match[2]) || parseInt(match[3]);
                    
                    if (quantity > 0 && width > 0 && length > 0) {
                        // Try to find a nearby unit price for this item
                        const windowStart = Math.max(0, match.index);
                        const windowEnd = Math.min(originalBody.length, windowStart + 300);
                        const windowText = originalBody.slice(windowStart, windowEnd);
                        const priceMatch = windowText.match(/(?:unit\s*price|price)[\s:]*?(?:[A-Z]{3}|sgd|s\$|\$)?\s*([\d,.]+)(?:\s*(?:per|each))?/i);
                        const extractedUnitPrice = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : null;

                        items.push({
                            name: `Pallet ${width}x${length}mm`,
                            quantity: quantity,
                            specifications: {
                                width: width,
                                length: length,
                                material: extractMaterial(email.body),
                                certification: extractCertifications(email.body)
                            },
                            unitPrice: extractedUnitPrice || calculatePrice(width, length, extractMaterial(email.body)),
                            type: 'pallet'
                        });
                    }
                }
            });
        }
        
        // AI Analysis based on email type
        switch(email.aiType) {
            case 'delay':
                aiAnalysis = {
                    priority: 'HIGH',
                    category: 'DELAY DETECTED',
                    keyPoints: [
                        '3-day shipping delay due to port congestion',
                        'Container MSKU7890123 affected',
                        '5% discount offered as compensation',
                        'Real-time tracking updates every 6 hours'
                    ],
                    actionRequired: 'Update inventory timeline and notify customers',
                    impactAssessment: 'Medium - affects production schedule'
                };
                break;
                
            case 'delivery':
                aiAnalysis = {
                    priority: 'NORMAL',
                    category: 'DELIVERY CONFIRMED',
                    keyPoints: [
                        '500 oak pallets arrived at Tuas Port',
                        'Container MSKU7890456 ready for pickup',
                        'Free storage until January 19, 2024',
                        'All customs documentation cleared'
                    ],
                    actionRequired: 'Schedule pickup within 5 days to avoid storage fees',
                    impactAssessment: 'Positive - inventory replenishment on schedule'
                };
                break;
                
            case 'quality':
                aiAnalysis = {
                    priority: 'HIGH',
                    category: 'QUALITY ALERT',
                    keyPoints: [
                        'Moisture content 18.2% (exceeds 15% standard)',
                        '340 pallets affected (40% of batch HW-MIX-QR01)',
                        'Dimensional deviations up to ±4.5mm found',
                        'Remediation plan initiated with 72-hour timeline'
                    ],
                    actionRequired: 'Quarantine affected inventory and arrange replacements',
                    impactAssessment: 'High - quality standards compromised'
                };
                break;
                
            case 'order':
                aiAnalysis = {
                    priority: 'URGENT',
                    category: 'PURCHASE ORDER',
                    keyPoints: [
                        '1,500 custom pallets (1100x1100mm) required',
                        'Phased delivery: 500 units every week starting Jan 25th',
                        'Automotive grade specifications with anti-static treatment',
                        'Potential for 2,000-3,000 monthly recurring orders'
                    ],
                    actionRequired: 'Confirm availability and provide quote by January 15th',
                    impactAssessment: 'Very High - major revenue opportunity'
                };
                break;
                
            case 'quote':
                aiAnalysis = {
                    priority: 'MEDIUM',
                    category: 'QUOTE REQUEST',
                    keyPoints: [
                        'Annual contract for 40,000+ pallets across 5 countries',
                        '24-month initial term with extension options',
                        'Multiple pallet types including pharmaceutical grade',
                        'Submission deadline: January 20th, 2024'
                    ],
                    actionRequired: 'Prepare comprehensive quotation with pricing matrix',
                    impactAssessment: 'Very High - strategic partnership opportunity'
                };
                break;
                
            default:
                aiAnalysis = {
                    priority: 'LOW',
                    category: 'GENERAL INFO',
                    keyPoints: ['Standard communication - no specific action required'],
                    actionRequired: 'Review and file for reference',
                    impactAssessment: 'Low - informational only'
                };
        }
        
        // Extract customer information
        const emailDomain = email.sender.split('@')[1];
        const customer = emailDomain ? emailDomain.split('.')[0] : 'Unknown Customer';
        const phone = extractPhone(originalBody);
        const deliveryDate = extractDeliveryDate(originalBody);
        const address = extractAddress(originalBody, email.aiType);
        
        return {
            id: null,
            customer: customer.charAt(0).toUpperCase() + customer.slice(1),
            email: email.sender,
            items: items,
            total: items.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 45)), 0),
            status: 'pending_review',
            source: 'ai_email_extraction',
            originalEmail: email.id,
            aiAnalysis: aiAnalysis,
            extractedAt: new Date().toISOString(),
            confidence: calculateConfidence(items, email.body),
            phone: phone || '',
            deliveryDate: deliveryDate || '',
            address: address || ''
        };
    }
    
    // Helper functions for enhanced extraction
    function extractMaterial(body) {
        const materials = ['oak', 'teak', 'pine', 'mahogany', 'hardwood', 'softwood'];
        for (const material of materials) {
            if (body.toLowerCase().includes(material)) {
                return material.charAt(0).toUpperCase() + material.slice(1);
            }
        }
        return 'Standard Wood';
    }
    
    function extractCertifications(body) {
        const certs = [];
        if (body.toLowerCase().includes('ispm-15')) certs.push('ISPM-15');
        if (body.toLowerCase().includes('fsc')) certs.push('FSC');
        if (body.toLowerCase().includes('heat-treated')) certs.push('Heat Treated');
        return certs;
    }
    
    function calculatePrice(width, length, material) {
        const area = (width * length) / 1000000; // Convert to square meters
        let basePrice = 45;
        
        // Adjust price based on material
        const materialMultipliers = {
            'Oak': 1.5,
            'Teak': 2.0,
            'Mahogany': 1.8,
            'Pine': 0.8,
            'Hardwood': 1.3
        };
        
        const multiplier = materialMultipliers[material] || 1.0;
        return Math.round(basePrice * area * multiplier);
    }
    
    function calculateConfidence(items, body) {
        let confidence = 0.5; // Base confidence
        
        // Increase confidence based on extracted items
        if (items.length > 0) confidence += 0.2;
        if (items.length > 2) confidence += 0.1;
        
        // Increase confidence based on specific keywords
        const keywords = ['quantity', 'delivery', 'specifications', 'requirements', 'urgent'];
        keywords.forEach(keyword => {
            if (body.toLowerCase().includes(keyword)) confidence += 0.05;
        });
        
        return Math.min(confidence, 1.0);
    }

    // Parse enumerated item blocks like:
    // 1. Euro Standard Pallets (1200x800x144mm)
    //    - Quantity: 800 pieces
    // 2. Industrial Heavy-Duty Pallets (1200x1000x150mm)
    //    - Quantity: 300 pieces
    function parseStructuredOrderItems(text) {
        const lines = text.split(/\r?\n/);
        const items = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const headerMatch = line.match(/^\d+\.\s*(.+?)\s*\((\d+)x(\d+)x(\d+)mm\)/i);
            if (headerMatch) {
                const name = headerMatch[1].trim();
                const width = parseInt(headerMatch[2]);
                const length = parseInt(headerMatch[3]);
                // height present in headerMatch[4] but not used for pricing

                // Look ahead a few lines for quantity
                let quantity = null;
                for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
                    const qMatch = lines[j].match(/quantity\s*:\s*(\d+)/i) || lines[j].match(/-\s*(\d+)\s*(?:units?|pieces?|pallets?)/i);
                    if (qMatch) {
                        quantity = parseInt(qMatch[1]);
                        break;
                    }
                }

                if (quantity && width && length) {
                    items.push({
                        name: name || `Pallet ${width}x${length}mm`,
                        quantity,
                        specifications: {
                            width,
                            length,
                            material: extractMaterial(text),
                            certification: extractCertifications(text)
                        },
                        unitPrice: calculatePrice(width, length, extractMaterial(text)),
                        type: 'pallet'
                    });
                }
            }
        }
        return items;
    }

    // Extract phone numbers in common formats (e.g., +65-6789-0123, +65 6789 0123, 6789-0123 with country code)
    function extractPhone(text) {
        const phoneRegexes = [
            /\+?\d{1,3}[\s-]?\(?\d{1,3}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/g,
            /\+?\d{2}[\s-]?\d{4}[\s-]?\d{4}/g
        ];
        for (const rx of phoneRegexes) {
            const m = text.match(rx);
            if (m && m.length) return m[0].trim();
        }
        return '';
    }

    // Convert matched date text to YYYY-MM-DD when possible
    function normalizeToISODate(dateText) {
        try {
            // Handle formats like "February 1-5, 2024" by taking first day
            const rangeMatch = dateText.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:\s*-\s*\d{1,2})?,?\s*(\d{4})/i);
            if (rangeMatch) {
                const monthName = rangeMatch[1];
                const day = rangeMatch[2];
                const year = rangeMatch[3];
                const d = new Date(`${monthName} ${day}, ${year}`);
                if (!isNaN(d)) return d.toISOString().slice(0, 10);
            }
            // Handle formats like 01/02/2024 or 1-2-2024
            const dmY = dateText.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
            if (dmY) {
                let [ , d, m, y ] = dmY;
                if (y.length === 2) y = '20' + y;
                const dd = d.padStart(2, '0');
                const mm = m.padStart(2, '0');
                return `${y}-${mm}-${dd}`;
            }
            // Fallback Date.parse
            const parsed = new Date(dateText);
            if (!isNaN(parsed)) return parsed.toISOString().slice(0, 10);
        } catch (_) {}
        return '';
    }

    // Extract expected delivery date, prioritizing phrases around delivery
    function extractDeliveryDate(text) {
        // Look for lines mentioning Requested Delivery / Delivery Date
        const lines = text.split(/\n|\r/);
        for (const line of lines) {
            if (/requested\s*delivery|delivery\s*date|delivery\s*window/i.test(line)) {
                const iso = normalizeToISODate(line);
                if (iso) return iso;
            }
        }
        // Fallback: any date-like phrase in entire text
        const iso = normalizeToISODate(text);
        return iso || '';
    }

    // Extract address for order-type emails. Looks for Delivery Location/Address lines
    function extractAddress(text, aiType) {
        const addrLabels = [
            /delivery\s*location\s*:\s*(.*)/i,
            /delivery\s*address\s*:\s*(.*)/i,
            /shipping\s*address\s*:\s*(.*)/i,
            /location\s*:\s*(.*)/i,
            /address\s*:\s*(.*)/i
        ];
        for (const rx of addrLabels) {
            const m = text.match(rx);
            if (m && m[1]) {
                return m[1].trim();
            }
        }
        return '';
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }
    }
    
    // Handle search
    function handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase().trim();
        
        if (!searchTerm) {
            filteredEmails = [...emails];
        } else {
            filteredEmails = emails.filter(email => 
                email.subject.toLowerCase().includes(searchTerm) ||
                email.sender.toLowerCase().includes(searchTerm) ||
                email.body.toLowerCase().includes(searchTerm) ||
                (email.intent && email.intent.toLowerCase().includes(searchTerm))
            );
        }
        
        renderEmailList();
        
        // Clear selection if current email is not in filtered results
        if (selectedEmailId && !filteredEmails.find(e => e.id === selectedEmailId)) {
            selectedEmailId = null;
            emailViewerEl.innerHTML = `
                <div class="viewer-placeholder">
                    <i class="fas fa-envelope-open"></i>
                    <h3>Select an email to preview</h3>
                    <p>Choose an email from the filtered list to view details.</p>
                </div>
            `;
        }
    }
    
    // Utility functions
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Today';
        } else if (diffDays === 2) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        }
    }
    
    function formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Show notification system
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add notification styles if not present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    border-left: 4px solid #3F7AB0;
                    padding: 16px;
                    min-width: 300px;
                    z-index: 1001;
                    animation: slideIn 0.3s ease;
                }
                .notification-success { border-left-color: #059669; }
                .notification-info { border-left-color: #3b82f6; }
                .notification-warning { border-left-color: #f59e0b; }
                .notification-error { border-left-color: #dc2626; }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #1e293b;
                }
                .notification-close {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: none;
                    border: none;
                    font-size: 16px;
                    color: #64748b;
                    cursor: pointer;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => notification.remove());
    }
    
    function getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    // Get AI icon based on type
    function getAIIcon(aiType) {
        const icons = {
            delay: 'clock',
            delivery: 'truck',
            quality: 'exclamation-triangle',
            order: 'shopping-cart',
            quote: 'file-invoice',
            info: 'info-circle'
        };
        return icons[aiType] || 'info-circle';
    }
    
    // Get AI label text
    function getAILabel(aiType) {
        const labels = {
            delay: 'DELAY DETECTED',
            delivery: 'DELIVERY CONFIRMED',
            quality: 'QUALITY ALERT',
            order: 'PURCHASE ORDER',
            quote: 'QUOTE REQUEST',
            info: 'GENERAL INFO'
        };
        return labels[aiType] || 'UNCATEGORIZED';
    }
    
    // Initialize the inbox when page loads
    initializeInbox();
    
    console.log('AI-Powered Inbox loaded successfully');
});
