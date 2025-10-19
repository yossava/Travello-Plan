import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
        departure: { airport: string; time: string };
        arrival: { airport: string; time: string };
        duration: string;
      };
      return: {
        airline: string;
        flightNumber: string;
        departure: { airport: string; time: string };
        arrival: { airport: string; time: string };
        duration: string;
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
      };
    };
    travelInfo?: {
      visaRequirements: string;
      healthAndSafety: string;
      currency: {
        name: string;
        exchangeRate: string;
      };
      emergencyContacts: {
        police: string;
        ambulance: string;
        embassy: string;
      };
    };
  };
}

export function generateTravelPlanPDF(planData: TravelPlanData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Helper function to add text with line wrapping (reserved for future use)
  // const addWrappedText = (text: string, x: number, y: number, maxWidth: number) => {
  //   const lines = doc.splitTextToSize(text, maxWidth);
  //   doc.text(lines, x, y);
  //   return y + (lines.length * 7);
  // };

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(planData.planName, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Trip Overview
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Trip Overview', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Origin: ${planData.origin.city}, ${planData.origin.country}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Destination: ${planData.destination.city}, ${planData.destination.country}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Departure: ${new Date(planData.departureDate).toLocaleDateString()}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Return: ${new Date(planData.returnDate).toLocaleDateString()}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Duration: ${planData.duration} days`, 14, yPosition);
  yPosition += 6;
  const totalTravelers = planData.travelers.adults + planData.travelers.children + planData.travelers.infants;
  doc.text(`Travelers: ${totalTravelers} people`, 14, yPosition);
  yPosition += 10;

  // Emergency Contacts
  if (planData.itinerary.travelInfo?.emergencyContacts) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38); // Red color
    doc.text('Emergency Contacts', 14, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`Police: ${planData.itinerary.travelInfo.emergencyContacts.police}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Ambulance: ${planData.itinerary.travelInfo.emergencyContacts.ambulance}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Embassy: ${planData.itinerary.travelInfo.emergencyContacts.embassy}`, 14, yPosition);
    yPosition += 10;
  }

  // Flights
  if (planData.itinerary.flights) {
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Flight Information', 14, yPosition);
    yPosition += 10;

    // Outbound Flight
    doc.setFontSize(12);
    doc.text('Outbound Flight', 14, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${planData.itinerary.flights.outbound.airline} - ${planData.itinerary.flights.outbound.flightNumber}`, 14, yPosition);
    yPosition += 6;
    doc.text(`${planData.itinerary.flights.outbound.departure.airport} (${planData.itinerary.flights.outbound.departure.time}) → ${planData.itinerary.flights.outbound.arrival.airport} (${planData.itinerary.flights.outbound.arrival.time})`, 14, yPosition);
    yPosition += 6;
    doc.text(`Duration: ${planData.itinerary.flights.outbound.duration}`, 14, yPosition);
    yPosition += 12;

    // Return Flight
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Return Flight', 14, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${planData.itinerary.flights.return.airline} - ${planData.itinerary.flights.return.flightNumber}`, 14, yPosition);
    yPosition += 6;
    doc.text(`${planData.itinerary.flights.return.departure.airport} (${planData.itinerary.flights.return.departure.time}) → ${planData.itinerary.flights.return.arrival.airport} (${planData.itinerary.flights.return.arrival.time})`, 14, yPosition);
    yPosition += 6;
    doc.text(`Duration: ${planData.itinerary.flights.return.duration}`, 14, yPosition);
    yPosition += 12;
  }

  // Accommodation
  if (planData.itinerary.accommodation) {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Accommodation', 14, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.text(planData.itinerary.accommodation.primary.name, 14, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(planData.itinerary.accommodation.primary.address, 14, yPosition);
    yPosition += 6;
    doc.text(`Check-in: ${new Date(planData.itinerary.accommodation.primary.checkIn).toLocaleDateString()}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Check-out: ${new Date(planData.itinerary.accommodation.primary.checkOut).toLocaleDateString()}`, 14, yPosition);
    yPosition += 6;
    doc.text(`${planData.itinerary.accommodation.primary.nights} nights - ${planData.budget.currency} ${planData.itinerary.accommodation.primary.totalCost.toLocaleString()}`, 14, yPosition);
    yPosition += 12;
  }

  // Daily Itinerary
  if (planData.itinerary.dailyItinerary) {
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Daily Itinerary', 14, yPosition);
    yPosition += 10;

    planData.itinerary.dailyItinerary.forEach((day) => {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Day ${day.day} - ${new Date(day.date).toLocaleDateString()}`, 14, yPosition);
      if (day.theme) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text(day.theme, 14, yPosition + 6);
        yPosition += 6;
      }
      yPosition += 10;

      // Activities table
      const activityData = day.activities.map((activity) => [
        activity.time,
        activity.title,
        activity.location,
        activity.duration,
        `${planData.budget.currency} ${activity.cost}`,
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Time', 'Activity', 'Location', 'Duration', 'Cost']],
        body: activityData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      yPosition = (doc as any).lastAutoTable.finalY + 10;
    });
  }

  // Budget Summary
  if (planData.itinerary.budgetBreakdown) {
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Budget Summary', 14, yPosition);
    yPosition += 10;

    const budgetData = [
      ['Flights', `${planData.budget.currency} ${planData.itinerary.budgetBreakdown.flights.toLocaleString()}`],
      ['Accommodation', `${planData.budget.currency} ${planData.itinerary.budgetBreakdown.accommodation.toLocaleString()}`],
      ['Food', `${planData.budget.currency} ${planData.itinerary.budgetBreakdown.food.toLocaleString()}`],
      ['Activities', `${planData.budget.currency} ${planData.itinerary.budgetBreakdown.activities.toLocaleString()}`],
      ['Transportation', `${planData.budget.currency} ${planData.itinerary.budgetBreakdown.transportation.toLocaleString()}`],
      ['Shopping', `${planData.budget.currency} ${planData.itinerary.budgetBreakdown.shopping.toLocaleString()}`],
      ['Emergency Fund', `${planData.budget.currency} ${planData.itinerary.budgetBreakdown.emergencyFund.toLocaleString()}`],
    ];

    autoTable(doc, {
      startY: yPosition,
      body: budgetData,
      theme: 'striped',
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yPosition = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${planData.budget.currency} ${planData.itinerary.budgetBreakdown.total.toLocaleString()}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Per Person: ${planData.budget.currency} ${planData.itinerary.budgetBreakdown.perPerson.toLocaleString()}`, 14, yPosition);
    yPosition += 6;
    doc.text(`Daily Average: ${planData.budget.currency} ${planData.itinerary.budgetBreakdown.dailyAverage.toLocaleString()}`, 14, yPosition);
  }

  // Save the PDF
  const filename = `${planData.planName.replace(/[^a-z0-9]/gi, '_')}_Travel_Plan.pdf`;
  doc.save(filename);
}
