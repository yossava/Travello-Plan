import PDFDocument from 'pdfkit';

interface TravelPlanData {
  planName: string;
  origin: { country: string; city: string };
  destination: { country: string; city: string };
  departureDate: string;
  returnDate: string;
  duration: number;
  travelers: { adults: number; children: number; infants: number };
  budget: { currency: string; min: number; max: number };
  itinerary: {
    dailyItinerary?: Array<{
      day: number;
      date: string;
      theme?: string;
      weather?: string;
      activities: Array<{
        time: string;
        type: string;
        title: string;
        description: string;
        location: string;
        duration: string;
        cost: number;
      }>;
      dailyTotal: number;
    }>;
    budgetBreakdown?: {
      flights: number;
      accommodation: number;
      food: number;
      activities: number;
      transportation: number;
      shopping: number;
      emergencyFund: number;
      total: number;
      perPerson: number;
      dailyAverage: number;
    };
    flights?: {
      outbound: {
        airline: string;
        flightNumber: string;
        departure: { airport: string; time: string; terminal?: string };
        arrival: { airport: string; time: string; terminal?: string };
        duration: string;
        class?: string;
        estimatedCost?: number;
      };
      return: {
        airline: string;
        flightNumber: string;
        departure: { airport: string; time: string; terminal?: string };
        arrival: { airport: string; time: string; terminal?: string };
        duration: string;
        class?: string;
        estimatedCost?: number;
      };
    };
    accommodation?: {
      primary: {
        name: string;
        type: string;
        address: string;
        checkIn: string;
        checkOut: string;
        nights: number;
        pricePerNight: number;
        totalCost: number;
        amenities?: string[];
      };
    };
    travelInfo?: {
      visaRequirements?: string;
      healthAndSafety?: string;
      currency?: {
        name: string;
        exchangeRate: string;
        tips?: string;
      };
      emergencyContacts?: {
        police: string;
        ambulance: string;
        embassy: string;
      };
      packingList?: string[];
      culturalTips?: string[];
    };
  };
}

const COLORS = {
  primary: '#7c3aed', // purple-600
  secondary: '#a78bfa', // purple-400
  accent: '#ec4899', // pink-500
  dark: '#1e293b', // slate-800
  light: '#f1f5f9', // slate-100
  text: '#0f172a', // slate-900
  textLight: '#64748b', // slate-500
  success: '#10b981', // green-500
  warning: '#f59e0b', // amber-500
  danger: '#ef4444', // red-500
};

export async function generateBeautifulPDF(
  planData: TravelPlanData
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      info: {
        Title: planData.planName,
        Author: 'TravelPlanner AI',
        Subject: 'Travel Itinerary',
      },
    });

    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
    doc.on('error', reject);

    const pageWidth = doc.page.width - 100; // Account for margins

    // Helper functions
    const drawGradientHeader = () => {
      // Gradient background for header
      doc
        .rect(0, 0, doc.page.width, 120)
        .fillAndStroke(COLORS.primary, COLORS.primary);

      // Add decorative element
      doc
        .rect(0, 115, doc.page.width, 5)
        .fillAndStroke(COLORS.accent, COLORS.accent);
    };

    const drawSectionHeader = (title: string, y: number, icon?: string) => {
      doc.fontSize(18).fillColor(COLORS.primary).font('Helvetica-Bold');
      if (icon) {
        doc.text(icon + ' ' + title, 50, y);
      } else {
        doc.text(title, 50, y);
      }
      doc
        .moveTo(50, y + 25)
        .lineTo(doc.page.width - 50, y + 25)
        .strokeColor(COLORS.secondary)
        .lineWidth(2)
        .stroke();
      return y + 35;
    };

    const addTextWithLabel = (
      label: string,
      value: string,
      x: number,
      y: number
    ) => {
      doc
        .fontSize(10)
        .fillColor(COLORS.textLight)
        .font('Helvetica-Bold')
        .text(label + ':', x, y);
      doc
        .fillColor(COLORS.text)
        .font('Helvetica')
        .text(value, x + 100, y, { width: pageWidth - 100 });
      return y + 20;
    };

    const checkPageBreak = (requiredSpace: number) => {
      if (doc.y + requiredSpace > doc.page.height - 50) {
        doc.addPage();
        return 50;
      }
      return doc.y;
    };

    // Page 1: Cover & Overview
    drawGradientHeader();

    // Title
    doc
      .fontSize(28)
      .fillColor('#ffffff')
      .font('Helvetica-Bold')
      .text(planData.planName, 50, 40, {
        align: 'center',
        width: pageWidth,
      });

    doc
      .fontSize(14)
      .fillColor('#e0e7ff')
      .font('Helvetica')
      .text(
        `${planData.destination.city}, ${planData.destination.country}`,
        50,
        75,
        {
          align: 'center',
          width: pageWidth,
        }
      );

    let yPos = 150;

    // Trip Overview Box
    doc
      .roundedRect(50, yPos, pageWidth, 150, 10)
      .fillAndStroke(COLORS.light, COLORS.secondary);

    yPos += 20;
    doc.fontSize(16).fillColor(COLORS.primary).font('Helvetica-Bold');
    doc.text('✈️ Trip Overview', 70, yPos);
    yPos += 30;

    doc.fontSize(11).fillColor(COLORS.text).font('Helvetica');
    const totalTravelers =
      planData.travelers.adults +
      planData.travelers.children +
      planData.travelers.infants;

    yPos = addTextWithLabel(
      'From',
      `${planData.origin.city}, ${planData.origin.country}`,
      70,
      yPos
    );
    yPos = addTextWithLabel(
      'To',
      `${planData.destination.city}, ${planData.destination.country}`,
      70,
      yPos
    );
    yPos = addTextWithLabel(
      'Departure',
      new Date(planData.departureDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      70,
      yPos
    );
    yPos = addTextWithLabel(
      'Return',
      new Date(planData.returnDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      70,
      yPos
    );
    yPos = addTextWithLabel(
      'Duration',
      `${planData.duration} days`,
      70,
      yPos
    );
    yPos = addTextWithLabel('Travelers', `${totalTravelers} people`, 70, yPos);

    yPos += 30;

    // Emergency Contacts
    if (planData.itinerary.travelInfo?.emergencyContacts) {
      yPos = checkPageBreak(120);
      doc
        .roundedRect(50, yPos, pageWidth, 110, 10)
        .fillAndStroke('#fef2f2', '#ef4444');

      yPos += 20;
      doc.fontSize(14).fillColor(COLORS.danger).font('Helvetica-Bold');
      doc.text('🚨 Emergency Contacts', 70, yPos);
      yPos += 25;

      doc.fontSize(11).fillColor(COLORS.text).font('Helvetica');
      yPos = addTextWithLabel(
        'Police',
        planData.itinerary.travelInfo.emergencyContacts.police,
        70,
        yPos
      );
      yPos = addTextWithLabel(
        'Ambulance',
        planData.itinerary.travelInfo.emergencyContacts.ambulance,
        70,
        yPos
      );
      yPos = addTextWithLabel(
        'Embassy',
        planData.itinerary.travelInfo.emergencyContacts.embassy,
        70,
        yPos
      );

      yPos += 30;
    }

    // Flights
    if (planData.itinerary.flights) {
      doc.addPage();
      yPos = drawSectionHeader('✈️ Flight Information', 50);

      // Outbound Flight
      yPos = checkPageBreak(160);
      doc
        .roundedRect(50, yPos, pageWidth, 140, 10)
        .fillAndStroke('#eff6ff', '#3b82f6');

      yPos += 20;
      doc.fontSize(14).fillColor('#1e40af').font('Helvetica-Bold');
      doc.text('→ Outbound Flight', 70, yPos);
      yPos += 25;

      doc.fontSize(11).fillColor(COLORS.text).font('Helvetica');
      yPos = addTextWithLabel(
        'Airline',
        `${planData.itinerary.flights.outbound.airline} - ${planData.itinerary.flights.outbound.flightNumber}`,
        70,
        yPos
      );
      yPos = addTextWithLabel(
        'Departure',
        `${planData.itinerary.flights.outbound.departure.airport} at ${planData.itinerary.flights.outbound.departure.time}${planData.itinerary.flights.outbound.departure.terminal ? ' (Terminal ' + planData.itinerary.flights.outbound.departure.terminal + ')' : ''}`,
        70,
        yPos
      );
      yPos = addTextWithLabel(
        'Arrival',
        `${planData.itinerary.flights.outbound.arrival.airport} at ${planData.itinerary.flights.outbound.arrival.time}${planData.itinerary.flights.outbound.arrival.terminal ? ' (Terminal ' + planData.itinerary.flights.outbound.arrival.terminal + ')' : ''}`,
        70,
        yPos
      );
      yPos = addTextWithLabel(
        'Duration',
        planData.itinerary.flights.outbound.duration,
        70,
        yPos
      );
      if (planData.itinerary.flights.outbound.class) {
        yPos = addTextWithLabel(
          'Class',
          planData.itinerary.flights.outbound.class,
          70,
          yPos
        );
      }

      yPos += 30;

      // Return Flight
      yPos = checkPageBreak(160);
      doc
        .roundedRect(50, yPos, pageWidth, 140, 10)
        .fillAndStroke('#fef3c7', '#f59e0b');

      yPos += 20;
      doc.fontSize(14).fillColor('#b45309').font('Helvetica-Bold');
      doc.text('← Return Flight', 70, yPos);
      yPos += 25;

      doc.fontSize(11).fillColor(COLORS.text).font('Helvetica');
      yPos = addTextWithLabel(
        'Airline',
        `${planData.itinerary.flights.return.airline} - ${planData.itinerary.flights.return.flightNumber}`,
        70,
        yPos
      );
      yPos = addTextWithLabel(
        'Departure',
        `${planData.itinerary.flights.return.departure.airport} at ${planData.itinerary.flights.return.departure.time}${planData.itinerary.flights.return.departure.terminal ? ' (Terminal ' + planData.itinerary.flights.return.departure.terminal + ')' : ''}`,
        70,
        yPos
      );
      yPos = addTextWithLabel(
        'Arrival',
        `${planData.itinerary.flights.return.arrival.airport} at ${planData.itinerary.flights.return.arrival.time}${planData.itinerary.flights.return.arrival.terminal ? ' (Terminal ' + planData.itinerary.flights.return.arrival.terminal + ')' : ''}`,
        70,
        yPos
      );
      yPos = addTextWithLabel(
        'Duration',
        planData.itinerary.flights.return.duration,
        70,
        yPos
      );
      if (planData.itinerary.flights.return.class) {
        yPos = addTextWithLabel(
          'Class',
          planData.itinerary.flights.return.class,
          70,
          yPos
        );
      }

      yPos += 30;
    }

    // Accommodation
    if (planData.itinerary.accommodation) {
      yPos = checkPageBreak(200);
      if (yPos === 50) {
        yPos = drawSectionHeader('🏨 Accommodation', 50);
      } else {
        yPos = drawSectionHeader('🏨 Accommodation', yPos + 20);
      }

      doc
        .roundedRect(50, yPos, pageWidth, 180, 10)
        .fillAndStroke('#f0fdf4', '#10b981');

      yPos += 20;
      doc.fontSize(14).fillColor('#047857').font('Helvetica-Bold');
      doc.text(planData.itinerary.accommodation.primary.name, 70, yPos, {
        width: pageWidth - 40,
      });
      yPos += 25;

      doc.fontSize(11).fillColor(COLORS.text).font('Helvetica');
      yPos = addTextWithLabel(
        'Type',
        planData.itinerary.accommodation.primary.type,
        70,
        yPos
      );
      yPos = addTextWithLabel(
        'Address',
        planData.itinerary.accommodation.primary.address,
        70,
        yPos
      );
      yPos = addTextWithLabel(
        'Check-in',
        new Date(
          planData.itinerary.accommodation.primary.checkIn
        ).toLocaleDateString(),
        70,
        yPos
      );
      yPos = addTextWithLabel(
        'Check-out',
        new Date(
          planData.itinerary.accommodation.primary.checkOut
        ).toLocaleDateString(),
        70,
        yPos
      );
      yPos = addTextWithLabel(
        'Nights',
        `${planData.itinerary.accommodation.primary.nights} nights`,
        70,
        yPos
      );
      yPos = addTextWithLabel(
        'Total Cost',
        `${planData.budget.currency} ${planData.itinerary.accommodation.primary.totalCost.toLocaleString()}`,
        70,
        yPos
      );

      yPos += 30;
    }

    // Daily Itinerary
    if (
      planData.itinerary.dailyItinerary &&
      planData.itinerary.dailyItinerary.length > 0
    ) {
      doc.addPage();
      yPos = drawSectionHeader('📅 Daily Itinerary', 50);

      planData.itinerary.dailyItinerary.forEach((day, index) => {
        yPos = checkPageBreak(200);
        if (yPos === 50 && index > 0) {
          yPos += 10;
        }

        // Day header
        doc
          .roundedRect(50, yPos, pageWidth, 50, 10)
          .fillAndStroke('#faf5ff', COLORS.secondary);

        yPos += 15;
        doc.fontSize(14).fillColor(COLORS.primary).font('Helvetica-Bold');
        doc.text(
          `Day ${day.day} - ${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`,
          70,
          yPos
        );

        if (day.theme) {
          yPos += 20;
          doc.fontSize(10).fillColor(COLORS.textLight).font('Helvetica-Italic');
          doc.text(day.theme, 70, yPos);
        }

        yPos += 35;

        // Activities
        day.activities.forEach((activity) => {
          yPos = checkPageBreak(80);

          // Activity box
          doc
            .roundedRect(50, yPos, pageWidth, 70, 5)
            .fillAndStroke('#ffffff', COLORS.light);

          yPos += 12;

          // Time badge
          doc
            .roundedRect(60, yPos, 60, 20, 5)
            .fillAndStroke(COLORS.primary, COLORS.primary);
          doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold');
          doc.text(activity.time, 60, yPos + 5, { width: 60, align: 'center' });

          // Title
          doc.fontSize(11).fillColor(COLORS.text).font('Helvetica-Bold');
          doc.text(activity.title, 130, yPos + 3, {
            width: pageWidth - 150,
          });

          yPos += 25;

          // Location and duration
          doc.fontSize(9).fillColor(COLORS.textLight).font('Helvetica');
          doc.text(`📍 ${activity.location}`, 60, yPos);
          doc.text(`⏱️ ${activity.duration}`, 280, yPos);
          doc.text(
            `${planData.budget.currency} ${activity.cost}`,
            doc.page.width - 130,
            yPos
          );

          yPos += 15;

          // Description
          if (activity.description) {
            doc.fontSize(9).fillColor(COLORS.text).font('Helvetica');
            doc.text(activity.description, 60, yPos, {
              width: pageWidth - 20,
            });
          }

          yPos += 25;
        });

        // Daily total
        yPos = checkPageBreak(30);
        doc
          .roundedRect(doc.page.width - 180, yPos, 130, 25, 5)
          .fillAndStroke('#ecfdf5', '#10b981');
        doc.fontSize(11).fillColor('#047857').font('Helvetica-Bold');
        doc.text(
          `Daily Total: ${planData.budget.currency} ${day.dailyTotal.toLocaleString()}`,
          doc.page.width - 175,
          yPos + 7
        );

        yPos += 40;
      });
    }

    // Budget Summary
    if (planData.itinerary.budgetBreakdown) {
      doc.addPage();
      yPos = drawSectionHeader('💰 Budget Summary', 50);

      const budgetItems = [
        { label: 'Flights', value: planData.itinerary.budgetBreakdown.flights },
        {
          label: 'Accommodation',
          value: planData.itinerary.budgetBreakdown.accommodation,
        },
        { label: 'Food', value: planData.itinerary.budgetBreakdown.food },
        {
          label: 'Activities',
          value: planData.itinerary.budgetBreakdown.activities,
        },
        {
          label: 'Transportation',
          value: planData.itinerary.budgetBreakdown.transportation,
        },
        {
          label: 'Shopping',
          value: planData.itinerary.budgetBreakdown.shopping,
        },
        {
          label: 'Emergency Fund',
          value: planData.itinerary.budgetBreakdown.emergencyFund,
        },
      ];

      budgetItems.forEach((item) => {
        yPos = checkPageBreak(35);

        doc
          .roundedRect(50, yPos, pageWidth, 30, 5)
          .fillAndStroke('#ffffff', COLORS.light);

        doc.fontSize(11).fillColor(COLORS.text).font('Helvetica');
        doc.text(item.label, 70, yPos + 10);

        doc.font('Helvetica-Bold');
        doc.text(
          `${planData.budget.currency} ${item.value.toLocaleString()}`,
          doc.page.width - 200,
          yPos + 10
        );

        yPos += 35;
      });

      // Total
      yPos = checkPageBreak(100);
      yPos += 10;

      doc
        .roundedRect(50, yPos, pageWidth, 80, 10)
        .fillAndStroke(COLORS.primary, COLORS.primary);

      yPos += 20;
      doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold');
      doc.text('Total Budget', 70, yPos);
      doc.text(
        `${planData.budget.currency} ${planData.itinerary.budgetBreakdown.total.toLocaleString()}`,
        doc.page.width - 250,
        yPos
      );

      yPos += 25;
      doc.fontSize(11);
      doc.text('Per Person', 70, yPos);
      doc.text(
        `${planData.budget.currency} ${planData.itinerary.budgetBreakdown.perPerson.toLocaleString()}`,
        doc.page.width - 250,
        yPos
      );

      yPos += 20;
      doc.text('Daily Average', 70, yPos);
      doc.text(
        `${planData.budget.currency} ${planData.itinerary.budgetBreakdown.dailyAverage.toLocaleString()}`,
        doc.page.width - 250,
        yPos
      );
    }

    // Footer on all pages
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc.fontSize(8).fillColor(COLORS.textLight).font('Helvetica');
      doc.text(
        `Generated by TravelPlanner AI - Page ${i + 1} of ${pageCount}`,
        50,
        doc.page.height - 30,
        {
          align: 'center',
          width: pageWidth,
        }
      );
    }

    doc.end();
  });
}
