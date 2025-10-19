import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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
  primary: rgb(0.486, 0.227, 0.929), // purple-600
  secondary: rgb(0.655, 0.545, 0.980), // purple-400
  accent: rgb(0.925, 0.282, 0.600), // pink-500
  dark: rgb(0.118, 0.161, 0.231), // slate-800
  light: rgb(0.945, 0.961, 0.976), // slate-100
  text: rgb(0.059, 0.090, 0.165), // slate-900
  textLight: rgb(0.392, 0.282, 0.545), // slate-500
  success: rgb(0.063, 0.725, 0.506), // green-500
  warning: rgb(0.961, 0.620, 0.043), // amber-500
  danger: rgb(0.937, 0.267, 0.267), // red-500
  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0),
};

export async function generateBeautifulPDF(
  planData: TravelPlanData
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595.28; // A4 width
  const pageHeight = 841.89; // A4 height
  const margin = 50;
  const contentWidth = pageWidth - 2 * margin;

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let yPosition = pageHeight - margin;

  // Helper functions
  const addNewPage = () => {
    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    yPosition = pageHeight - margin;
    return yPosition;
  };

  const checkPageSpace = (required: number) => {
    if (yPosition - required < margin) {
      addNewPage();
    }
  };

  const drawText = (
    text: string,
    x: number,
    y: number,
    options: {
      size?: number;
      font?: typeof helveticaFont;
      color?: typeof COLORS.text;
      maxWidth?: number;
    } = {}
  ) => {
    const {
      size = 12,
      font = helveticaFont,
      color = COLORS.text,
      maxWidth,
    } = options;

    let displayText = text;
    if (maxWidth) {
      const textWidth = font.widthOfTextAtSize(text, size);
      if (textWidth > maxWidth) {
        // Truncate text if too long
        let truncated = text;
        while (font.widthOfTextAtSize(truncated + '...', size) > maxWidth) {
          truncated = truncated.slice(0, -1);
        }
        displayText = truncated + '...';
      }
    }

    currentPage.drawText(displayText, {
      x,
      y,
      size,
      font,
      color,
    });
  };

  const drawBox = (
    x: number,
    y: number,
    width: number,
    height: number,
    options: {
      fill?: typeof COLORS.light;
      border?: typeof COLORS.primary;
      borderWidth?: number;
    } = {}
  ) => {
    const { fill, border, borderWidth = 1 } = options;

    if (fill) {
      currentPage.drawRectangle({
        x,
        y,
        width,
        height,
        color: fill,
      });
    }

    if (border) {
      currentPage.drawRectangle({
        x,
        y,
        width,
        height,
        borderColor: border,
        borderWidth,
      });
    }
  };

  // Title Page
  drawBox(0, pageHeight - 120, pageWidth, 120, { fill: COLORS.primary });

  drawText(planData.planName, pageWidth / 2, pageHeight - 60, {
    size: 24,
    font: helveticaBold,
    color: COLORS.white,
    maxWidth: contentWidth,
  });

  // Center text manually (pdf-lib doesn't have align:center)
  const subtitleText = `${planData.destination.city}, ${planData.destination.country}`;
  const subtitleWidth = helveticaFont.widthOfTextAtSize(subtitleText, 14);
  drawText(subtitleText, (pageWidth - subtitleWidth) / 2, pageHeight - 90, {
    size: 14,
    color: COLORS.white,
  });

  yPosition = pageHeight - 160;

  // Trip Overview Box
  checkPageSpace(200);
  drawBox(margin, yPosition - 180, contentWidth, 180, {
    fill: COLORS.light,
    border: COLORS.secondary,
    borderWidth: 2,
  });

  yPosition -= 30;
  drawText('Trip Overview', margin + 20, yPosition, {
    size: 16,
    font: helveticaBold,
    color: COLORS.primary,
  });

  yPosition -= 30;
  const totalTravelers =
    planData.travelers.adults +
    planData.travelers.children +
    planData.travelers.infants;

  const addInfoLine = (label: string, value: string) => {
    drawText(label + ':', margin + 20, yPosition, {
      size: 11,
      font: helveticaBold,
      color: COLORS.textLight,
    });
    drawText(value, margin + 120, yPosition, {
      size: 11,
      maxWidth: contentWidth - 120,
    });
    yPosition -= 20;
  };

  addInfoLine(
    'From',
    `${planData.origin.city}, ${planData.origin.country}`
  );
  addInfoLine(
    'To',
    `${planData.destination.city}, ${planData.destination.country}`
  );
  addInfoLine(
    'Departure',
    new Date(planData.departureDate).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  );
  addInfoLine(
    'Return',
    new Date(planData.returnDate).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  );
  addInfoLine('Duration', `${planData.duration} days`);
  addInfoLine('Travelers', `${totalTravelers} people`);

  yPosition -= 30;

  // Emergency Contacts
  if (planData.itinerary.travelInfo?.emergencyContacts) {
    checkPageSpace(150);
    drawBox(margin, yPosition - 130, contentWidth, 130, {
      fill: rgb(0.996, 0.949, 0.949),
      border: COLORS.danger,
      borderWidth: 2,
    });

    yPosition -= 30;
    drawText('EMERGENCY CONTACTS', margin + 20, yPosition, {
      size: 14,
      font: helveticaBold,
      color: COLORS.danger,
    });

    yPosition -= 30;
    addInfoLine(
      'Police',
      planData.itinerary.travelInfo.emergencyContacts.police
    );
    addInfoLine(
      'Ambulance',
      planData.itinerary.travelInfo.emergencyContacts.ambulance
    );
    addInfoLine(
      'Embassy',
      planData.itinerary.travelInfo.emergencyContacts.embassy
    );

    yPosition -= 30;
  }

  // Flights Section
  if (planData.itinerary.flights) {
    addNewPage();

    drawText('Flight Information', margin, yPosition, {
      size: 18,
      font: helveticaBold,
      color: COLORS.primary,
    });

    yPosition -= 40;

    // Outbound Flight
    checkPageSpace(160);
    drawBox(margin, yPosition - 140, contentWidth, 140, {
      fill: rgb(0.937, 0.965, 1),
      border: rgb(0.231, 0.510, 0.965),
      borderWidth: 2,
    });

    yPosition -= 30;
    drawText('→ Outbound Flight', margin + 20, yPosition, {
      size: 14,
      font: helveticaBold,
      color: rgb(0.118, 0.251, 0.690),
    });

    yPosition -= 30;
    addInfoLine(
      'Airline',
      `${planData.itinerary.flights.outbound.airline} - ${planData.itinerary.flights.outbound.flightNumber}`
    );
    addInfoLine(
      'Departure',
      `${planData.itinerary.flights.outbound.departure.airport} at ${planData.itinerary.flights.outbound.departure.time}`
    );
    addInfoLine(
      'Arrival',
      `${planData.itinerary.flights.outbound.arrival.airport} at ${planData.itinerary.flights.outbound.arrival.time}`
    );
    addInfoLine('Duration', planData.itinerary.flights.outbound.duration);

    yPosition -= 40;

    // Return Flight
    checkPageSpace(160);
    drawBox(margin, yPosition - 140, contentWidth, 140, {
      fill: rgb(0.996, 0.953, 0.780),
      border: COLORS.warning,
      borderWidth: 2,
    });

    yPosition -= 30;
    drawText('← Return Flight', margin + 20, yPosition, {
      size: 14,
      font: helveticaBold,
      color: rgb(0.706, 0.325, 0.035),
    });

    yPosition -= 30;
    addInfoLine(
      'Airline',
      `${planData.itinerary.flights.return.airline} - ${planData.itinerary.flights.return.flightNumber}`
    );
    addInfoLine(
      'Departure',
      `${planData.itinerary.flights.return.departure.airport} at ${planData.itinerary.flights.return.departure.time}`
    );
    addInfoLine(
      'Arrival',
      `${planData.itinerary.flights.return.arrival.airport} at ${planData.itinerary.flights.return.arrival.time}`
    );
    addInfoLine('Duration', planData.itinerary.flights.return.duration);

    yPosition -= 40;
  }

  // Accommodation
  if (planData.itinerary.accommodation) {
    checkPageSpace(200);

    drawText('Accommodation', margin, yPosition, {
      size: 18,
      font: helveticaBold,
      color: COLORS.primary,
    });

    yPosition -= 40;

    drawBox(margin, yPosition - 160, contentWidth, 160, {
      fill: rgb(0.941, 0.992, 0.957),
      border: COLORS.success,
      borderWidth: 2,
    });

    yPosition -= 30;
    drawText(planData.itinerary.accommodation.primary.name, margin + 20, yPosition, {
      size: 14,
      font: helveticaBold,
      color: rgb(0.016, 0.463, 0.341),
      maxWidth: contentWidth - 40,
    });

    yPosition -= 30;
    addInfoLine('Type', planData.itinerary.accommodation.primary.type);
    addInfoLine('Address', planData.itinerary.accommodation.primary.address);
    addInfoLine(
      'Check-in',
      new Date(
        planData.itinerary.accommodation.primary.checkIn
      ).toLocaleDateString()
    );
    addInfoLine(
      'Check-out',
      new Date(
        planData.itinerary.accommodation.primary.checkOut
      ).toLocaleDateString()
    );
    addInfoLine(
      'Total',
      `${planData.budget.currency} ${planData.itinerary.accommodation.primary.totalCost.toLocaleString()}`
    );

    yPosition -= 40;
  }

  // Daily Itinerary
  if (
    planData.itinerary.dailyItinerary &&
    planData.itinerary.dailyItinerary.length > 0
  ) {
    addNewPage();

    drawText('Daily Itinerary', margin, yPosition, {
      size: 18,
      font: helveticaBold,
      color: COLORS.primary,
    });

    yPosition -= 40;

    planData.itinerary.dailyItinerary.forEach((day) => {
      checkPageSpace(100);

      // Day header
      drawBox(margin, yPosition - 50, contentWidth, 50, {
        fill: rgb(0.980, 0.961, 1),
        border: COLORS.secondary,
        borderWidth: 2,
      });

      yPosition -= 20;
      drawText(
        `Day ${day.day} - ${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`,
        margin + 20,
        yPosition,
        {
          size: 14,
          font: helveticaBold,
          color: COLORS.primary,
        }
      );

      if (day.theme) {
        yPosition -= 18;
        drawText(day.theme, margin + 20, yPosition, {
          size: 10,
          color: COLORS.textLight,
        });
      }

      yPosition -= 30;

      // Activities (limit to first 5 to keep PDF reasonable)
      const activitiesToShow = day.activities.slice(0, 5);
      activitiesToShow.forEach((activity) => {
        checkPageSpace(80);

        drawBox(margin, yPosition - 70, contentWidth, 70, {
          fill: COLORS.white,
          border: COLORS.light,
          borderWidth: 1,
        });

        yPosition -= 20;

        // Time badge
        drawBox(margin + 10, yPosition - 5, 60, 20, {
          fill: COLORS.primary,
        });
        const timeText = activity.time;
        const timeWidth = helveticaBold.widthOfTextAtSize(timeText, 9);
        drawText(timeText, margin + 10 + (60 - timeWidth) / 2, yPosition, {
          size: 9,
          font: helveticaBold,
          color: COLORS.white,
        });

        // Activity title
        drawText(activity.title, margin + 80, yPosition, {
          size: 11,
          font: helveticaBold,
          maxWidth: contentWidth - 90,
        });

        yPosition -= 20;

        // Location and cost
        drawText(`Location: ${activity.location}`, margin + 10, yPosition, {
          size: 9,
          color: COLORS.textLight,
          maxWidth: 250,
        });

        drawText(
          `${planData.budget.currency} ${activity.cost}`,
          pageWidth - margin - 80,
          yPosition,
          {
            size: 9,
            color: COLORS.textLight,
          }
        );

        yPosition -= 50;
      });

      if (day.activities.length > 5) {
        yPosition -= 20;
        drawText(
          `... and ${day.activities.length - 5} more activities`,
          margin + 20,
          yPosition,
          {
            size: 10,
            color: COLORS.textLight,
          }
        );
        yPosition -= 10;
      }

      // Daily total
      yPosition -= 30;
      drawBox(pageWidth - margin - 150, yPosition - 5, 150, 25, {
        fill: rgb(0.925, 0.992, 0.957),
        border: COLORS.success,
        borderWidth: 1,
      });
      const totalText = `Daily Total: ${planData.budget.currency} ${day.dailyTotal.toLocaleString()}`;
      drawText(totalText, pageWidth - margin - 140, yPosition, {
        size: 11,
        font: helveticaBold,
        color: rgb(0.016, 0.463, 0.341),
      });

      yPosition -= 50;
    });
  }

  // Budget Summary
  if (planData.itinerary.budgetBreakdown) {
    addNewPage();

    drawText('Budget Summary', margin, yPosition, {
      size: 18,
      font: helveticaBold,
      color: COLORS.primary,
    });

    yPosition -= 40;

    const budgetItems = [
      {
        label: 'Flights',
        value: planData.itinerary.budgetBreakdown.flights,
      },
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
      checkPageSpace(40);

      drawBox(margin, yPosition - 30, contentWidth, 30, {
        fill: COLORS.white,
        border: COLORS.light,
        borderWidth: 1,
      });

      yPosition -= 20;
      drawText(item.label, margin + 20, yPosition, {
        size: 11,
      });

      const valueText = `${planData.budget.currency} ${item.value.toLocaleString()}`;
      const valueWidth = helveticaBold.widthOfTextAtSize(valueText, 11);
      drawText(valueText, pageWidth - margin - valueWidth - 20, yPosition, {
        size: 11,
        font: helveticaBold,
      });

      yPosition -= 20;
    });

    yPosition -= 20;

    // Total
    checkPageSpace(100);
    drawBox(margin, yPosition - 80, contentWidth, 80, {
      fill: COLORS.primary,
    });

    yPosition -= 25;
    drawText('Total Budget', margin + 20, yPosition, {
      size: 14,
      font: helveticaBold,
      color: COLORS.white,
    });

    const totalText = `${planData.budget.currency} ${planData.itinerary.budgetBreakdown.total.toLocaleString()}`;
    const totalWidth = helveticaBold.widthOfTextAtSize(totalText, 14);
    drawText(totalText, pageWidth - margin - totalWidth - 20, yPosition, {
      size: 14,
      font: helveticaBold,
      color: COLORS.white,
    });

    yPosition -= 25;
    drawText('Per Person', margin + 20, yPosition, {
      size: 11,
      color: COLORS.white,
    });

    const perPersonText = `${planData.budget.currency} ${planData.itinerary.budgetBreakdown.perPerson.toLocaleString()}`;
    const perPersonWidth = helveticaFont.widthOfTextAtSize(perPersonText, 11);
    drawText(perPersonText, pageWidth - margin - perPersonWidth - 20, yPosition, {
      size: 11,
      color: COLORS.white,
    });

    yPosition -= 20;
    drawText('Daily Average', margin + 20, yPosition, {
      size: 11,
      color: COLORS.white,
    });

    const dailyText = `${planData.budget.currency} ${planData.itinerary.budgetBreakdown.dailyAverage.toLocaleString()}`;
    const dailyWidth = helveticaFont.widthOfTextAtSize(dailyText, 11);
    drawText(dailyText, pageWidth - margin - dailyWidth - 20, yPosition, {
      size: 11,
      color: COLORS.white,
    });
  }

  // Add footer to all pages
  const pages = pdfDoc.getPages();
  pages.forEach((page, index) => {
    const footerText = `Generated by TravelPlanner AI - Page ${index + 1} of ${pages.length}`;
    const footerWidth = helveticaFont.widthOfTextAtSize(footerText, 8);
    page.drawText(footerText, {
      x: (pageWidth - footerWidth) / 2,
      y: 20,
      size: 8,
      font: helveticaFont,
      color: COLORS.textLight,
    });
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
