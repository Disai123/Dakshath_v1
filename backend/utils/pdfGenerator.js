const PDFDocument = require('pdfkit');

// Set to true to show hackathon points/counts again in Dakshath PDFs (no DB change needed).
const SHOW_HACKATHON_IN_DAKSHATH = false;

/**
 * Generate beautiful student profile PDF
 */
const generateStudentProfilePDF = (profileData) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                margin: 40,
                size: 'A4',
                bufferPages: true
            });
            const chunks = [];

            // Collect PDF data
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Define colors
            const colors = {
                primary: '#2563eb',
                secondary: '#1e40af',
                accent: '#3b82f6',
                success: '#10b981',
                text: '#1f2937',
                textLight: '#6b7280',
                border: '#e5e7eb',
                background: '#f9fafb'
            };

            // Header with gradient effect (simulated with rectangles)
            doc.rect(0, 0, doc.page.width, 120).fill(colors.primary);
            doc.rect(0, 100, doc.page.width, 20).fillOpacity(0.3).fill('#ffffff');

            // Title
            doc.fillOpacity(1)
                .fontSize(32)
                .fillColor('#ffffff')
                .font('Helvetica-Bold')
                .text('STUDENT PROFILE', 40, 35, { align: 'center' });

            // Student Name
            doc.fontSize(18)
                .fillColor('#ffffff')
                .font('Helvetica')
                .text(profileData.personal_information.name, 40, 70, { align: 'center' });

            // Reset position after header
            doc.y = 140;

            // Personal Information Section
            addSectionHeader(doc, 'Personal Information', colors);
            addInfoBox(doc, [
                { label: 'Email', value: profileData.personal_information.email, icon: '✉' },
                { label: 'Phone', value: profileData.personal_information.phone || 'Not provided', icon: '📱' },
                { label: 'Date of Birth', value: profileData.personal_information.date_of_birth ? new Date(profileData.personal_information.date_of_birth).toLocaleDateString() : 'Not provided', icon: '📅' },
                { label: 'Gender', value: profileData.personal_information.gender || 'Not provided', icon: '👤' }
            ], colors);

            const address = [
                profileData.personal_information.address,
                profileData.personal_information.city,
                profileData.personal_information.state,
                profileData.personal_information.country,
                profileData.personal_information.pincode
            ].filter(Boolean).join(', ');

            if (address) {
                addFieldWithIcon(doc, '📍', 'Address', address, colors);
            }
            doc.moveDown(1.5);

            // Education Section
            addSectionHeader(doc, 'Education', colors);
            addInfoBox(doc, [
                { label: 'Education Level', value: profileData.education.current_education || 'Not provided', icon: '🎓' },
                { label: 'Institution', value: profileData.education.institution || 'Not provided', icon: '🏫' },
                { label: 'Graduation Year', value: profileData.education.graduation_year || 'Not provided', icon: '📆' },
                { label: 'CGPA', value: profileData.education.cgpa || 'Not provided', icon: '⭐' }
            ], colors);
            doc.moveDown(1.5);

            // Professional Information Section
            addSectionHeader(doc, 'Professional Information', colors);

            if (profileData.professional.bio) {
                addFieldWithIcon(doc, '💼', 'Bio', profileData.professional.bio, colors, true);
                doc.moveDown(0.5);
            }

            // Skills with badges
            if (profileData.professional.skills && profileData.professional.skills.length > 0) {
                doc.fontSize(11).fillColor(colors.text).font('Helvetica-Bold').text('🔧 Skills:', 50);
                doc.moveDown(0.3);

                let xPos = 60;
                let yPos = doc.y;
                profileData.professional.skills.forEach((skill, index) => {
                    const skillWidth = doc.widthOfString(skill) + 20;

                    if (xPos + skillWidth > doc.page.width - 50) {
                        xPos = 60;
                        yPos += 25;
                    }

                    // Skill badge
                    doc.roundedRect(xPos, yPos, skillWidth, 20, 10)
                        .fillAndStroke(colors.accent, colors.primary);

                    doc.fontSize(9)
                        .fillColor('#ffffff')
                        .font('Helvetica')
                        .text(skill, xPos + 10, yPos + 6, { width: skillWidth - 20 });

                    xPos += skillWidth + 10;
                });

                doc.y = yPos + 30;
            }

            // Social Links
            if (profileData.professional.linkedin_url || profileData.professional.github_url || profileData.professional.portfolio_url) {
                doc.moveDown(0.5);
                if (profileData.professional.linkedin_url) {
                    addLinkField(doc, '🔗', 'LinkedIn', profileData.professional.linkedin_url, colors);
                }
                if (profileData.professional.github_url) {
                    addLinkField(doc, '💻', 'GitHub', profileData.professional.github_url, colors);
                }
                if (profileData.professional.portfolio_url) {
                    addLinkField(doc, '🌐', 'Portfolio', profileData.professional.portfolio_url, colors);
                }
            }
            doc.moveDown(1.5);

            // Academic Performance Section with colored boxes
            addSectionHeader(doc, 'Academic Performance', colors);

            const score = profileData.academic_performance.score;
            const displayTotalPoints = SHOW_HACKATHON_IN_DAKSHATH
                ? (score.total_points || 0)
                : ((score.total_course_points || 0) + (score.total_project_points || 0));
            const scoreBoxes = [
                { label: 'Total Points', value: displayTotalPoints, color: colors.primary },
                { label: 'Course Points', value: score.total_course_points || 0, color: colors.success },
                { label: 'Project Points', value: score.total_project_points || 0, color: '#8b5cf6' },
                // Kept for easy revert — gated by SHOW_HACKATHON_IN_DAKSHATH
                ...(SHOW_HACKATHON_IN_DAKSHATH
                    ? [{ label: 'Hackathon Points', value: score.total_hackathon_points || 0, color: '#f59e0b' }]
                    : [])
            ];

            let startX = 50;
            const boxWidth = SHOW_HACKATHON_IN_DAKSHATH ? 120 : 160;
            const boxHeight = 60;

            scoreBoxes.forEach((box, index) => {
                const xPos = startX + (index * (boxWidth + 10));
                const yPos = doc.y;

                // Box with shadow effect
                doc.rect(xPos + 2, yPos + 2, boxWidth, boxHeight).fill('#00000020');
                doc.roundedRect(xPos, yPos, boxWidth, boxHeight, 5).fillAndStroke(box.color, box.color);

                // Value
                doc.fontSize(24)
                    .fillColor('#ffffff')
                    .font('Helvetica-Bold')
                    .text(box.value.toString(), xPos, yPos + 12, { width: boxWidth, align: 'center' });

                // Label
                doc.fontSize(9)
                    .fillColor('#ffffff')
                    .font('Helvetica')
                    .text(box.label, xPos, yPos + 40, { width: boxWidth, align: 'center' });
            });

            doc.y += boxHeight + 20;

            // Achievement counts
            const counts = [
                { label: 'Courses Completed', value: score.courses_completed_count || 0 },
                { label: 'Projects Approved', value: score.projects_approved_count || 0 },
                // Kept for easy revert — gated by SHOW_HACKATHON_IN_DAKSHATH
                ...(SHOW_HACKATHON_IN_DAKSHATH
                    ? [{ label: 'Hackathons', value: score.hackathons_approved_count || 0 }]
                    : [])
            ];

            counts.forEach(item => {
                doc.fontSize(10)
                    .fillColor(colors.text)
                    .font('Helvetica-Bold')
                    .text(`✓ ${item.label}: `, 50, doc.y, { continued: true })
                    .font('Helvetica')
                    .fillColor(colors.textLight)
                    .text(item.value.toString());
                doc.moveDown(0.3);
            });

            doc.moveDown(1);

            // Achievements Section
            if (profileData.academic_performance.achievements && profileData.academic_performance.achievements.length > 0) {
                addSectionHeader(doc, 'Recent Achievements', colors);

                const achievementsForPdf = SHOW_HACKATHON_IN_DAKSHATH
                    ? profileData.academic_performance.achievements
                    : profileData.academic_performance.achievements.filter(
                        (a) => a.achievement_type !== 'hackathon_approval'
                    );

                achievementsForPdf.slice(0, 8).forEach((achievement, index) => {
                    const yPos = doc.y;

                    // Achievement item with background
                    doc.roundedRect(50, yPos, doc.page.width - 100, 25, 3)
                        .fillAndStroke(colors.background, colors.border);

                    doc.fontSize(10)
                        .fillColor(colors.text)
                        .font('Helvetica')
                        .text(`${index + 1}. ${achievement.achievement_type}`, 60, yPos + 8, { continued: true })
                        .fillColor(colors.success)
                        .font('Helvetica-Bold')
                        .text(` +${achievement.points_awarded} pts`, { continued: true })
                        .fillColor(colors.textLight)
                        .font('Helvetica')
                        .fontSize(8)
                        .text(` • ${new Date(achievement.awarded_at).toLocaleDateString()}`);

                    doc.y = yPos + 30;
                });

                if (achievementsForPdf.length > 8) {
                    doc.fontSize(9)
                        .fillColor(colors.textLight)
                        .font('Helvetica-Oblique')
                        .text(`... and ${achievementsForPdf.length - 8} more achievements`, 50);
                }
                doc.moveDown(1);
            }

            // Certificates Section
            if (profileData.academic_performance.certificates && profileData.academic_performance.certificates.length > 0) {
                addSectionHeader(doc, 'Certificates', colors);

                profileData.academic_performance.certificates.forEach((cert, index) => {
                    doc.fontSize(10)
                        .fillColor(colors.text)
                        .font('Helvetica')
                        .text(`🏆 ${cert.course_title}`, 60, doc.y, { continued: true })
                        .fillColor(colors.textLight)
                        .fontSize(8)
                        .text(` • Issued: ${new Date(cert.issued_at).toLocaleDateString()}`);
                    doc.moveDown(0.5);
                });
                doc.moveDown(0.5);
            }

            // Footer
            const pageCount = doc.bufferedPageRange().count;
            for (let i = 0; i < pageCount; i++) {
                doc.switchToPage(i);

                // Footer line
                doc.moveTo(40, doc.page.height - 60)
                    .lineTo(doc.page.width - 40, doc.page.height - 60)
                    .stroke(colors.border);

                // Footer text
                doc.fontSize(8)
                    .fillColor(colors.textLight)
                    .font('Helvetica')
                    .text(
                        'Generated by Dakshath Job & Internship Platform',
                        40,
                        doc.page.height - 45,
                        { align: 'center', width: doc.page.width - 80 }
                    );

                doc.text(
                    `Page ${i + 1} of ${pageCount} • ${new Date().toLocaleDateString()}`,
                    40,
                    doc.page.height - 30,
                    { align: 'center', width: doc.page.width - 80 }
                );
            }

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Add section header with styling
 */
function addSectionHeader(doc, title, colors) {
    const yPos = doc.y;

    // Section background bar
    doc.rect(40, yPos, doc.page.width - 80, 30)
        .fillAndStroke(colors.primary, colors.secondary);

    // Section title
    doc.fontSize(14)
        .fillColor('#ffffff')
        .font('Helvetica-Bold')
        .text(title, 50, yPos + 8);

    doc.y = yPos + 40;
}

/**
 * Add info box with multiple fields
 */
function addInfoBox(doc, fields, colors) {
    fields.forEach(field => {
        addFieldWithIcon(doc, field.icon, field.label, field.value, colors);
    });
}

/**
 * Add field with icon
 */
function addFieldWithIcon(doc, icon, label, value, colors, multiline = false) {
    const yPos = doc.y;

    doc.fontSize(11)
        .fillColor(colors.text)
        .font('Helvetica')
        .text(icon, 50, yPos, { continued: true })
        .font('Helvetica-Bold')
        .text(` ${label}: `, { continued: !multiline });

    if (!multiline) {
        doc.font('Helvetica')
            .fillColor(colors.textLight)
            .text(value);
    } else {
        doc.font('Helvetica')
            .fillColor(colors.textLight)
            .text(value, 50, doc.y + 5, { width: doc.page.width - 100 });
    }

    doc.moveDown(0.3);
}

/**
 * Add link field
 */
function addLinkField(doc, icon, label, url, colors) {
    doc.fontSize(10)
        .fillColor(colors.text)
        .font('Helvetica')
        .text(icon, 50, doc.y, { continued: true })
        .text(` ${label}: `, { continued: true })
        .fillColor(colors.accent)
        .font('Helvetica')
        .text(url, { link: url, underline: true });
    doc.moveDown(0.3);
}

module.exports = {
    generateStudentProfilePDF
};
