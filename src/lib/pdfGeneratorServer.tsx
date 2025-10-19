import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { renderToBuffer } from '@react-pdf/renderer';

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

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#7c3aed',
    padding: 40,
    marginBottom: 30,
    marginLeft: -40,
    marginRight: -40,
    marginTop: -40,
  },
  accentBar: {
    height: 4,
    backgroundColor: '#ec4899',
    marginBottom: 20,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e7ff',
    textAlign: 'center',
    fontWeight: 'normal',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7c3aed',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: '2 solid #ddd6fe',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#faf9fc',
    padding: 20,
    marginBottom: 15,
    borderLeft: '4 solid #7c3aed',
  },
  cardHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 11,
    color: '#64748b',
    width: 120,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 11,
    color: '#0f172a',
    flex: 1,
    lineHeight: 1.4,
  },
  emergencyCard: {
    backgroundColor: '#fef2f2',
    padding: 20,
    marginBottom: 15,
    borderLeft: '4 solid #ef4444',
  },
  emergencyTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 12,
  },
  flightCard: {
    backgroundColor: '#eff6ff',
    padding: 20,
    marginBottom: 15,
    borderLeft: '4 solid #3b82f6',
  },
  returnFlightCard: {
    backgroundColor: '#fffbeb',
    padding: 20,
    marginBottom: 15,
    borderLeft: '4 solid #f59e0b',
  },
  accommodationCard: {
    backgroundColor: '#f0fdf4',
    padding: 20,
    marginBottom: 15,
    borderLeft: '4 solid #10b981',
  },
  dayHeader: {
    backgroundColor: '#faf5ff',
    padding: 15,
    marginBottom: 15,
    borderLeft: '4 solid #a78bfa',
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7c3aed',
    marginBottom: 6,
  },
  dayTheme: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic',
    lineHeight: 1.3,
  },
  activity: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 12,
    border: '1 solid #e2e8f0',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityTime: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#7c3aed',
    padding: '6 12',
    borderRadius: 4,
    marginRight: 10,
  },
  activityTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    lineHeight: 1.3,
  },
  activityDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTop: '1 solid #f1f5f9',
  },
  activityDetailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  activityDetailLabel: {
    fontSize: 10,
    color: '#64748b',
    width: 70,
  },
  activityDetailValue: {
    fontSize: 10,
    color: '#1e293b',
    flex: 1,
  },
  budgetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#ffffff',
    marginBottom: 8,
    border: '1 solid #e2e8f0',
  },
  budgetLabel: {
    fontSize: 11,
    color: '#1e293b',
  },
  budgetValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  budgetTotal: {
    backgroundColor: '#7c3aed',
    padding: 20,
    marginTop: 15,
  },
  budgetTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  budgetTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dailyTotal: {
    backgroundColor: '#f0fdf4',
    padding: 15,
    marginTop: 15,
    borderLeft: '4 solid #10b981',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyTotalLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#047857',
  },
  dailyTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#047857',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#64748b',
  },
});

const TravelPlanPDF = ({ data }: { data: TravelPlanData }) => {
  const totalTravelers =
    data.travelers.adults + data.travelers.children + data.travelers.infants;

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.accentBar} />
          <Text style={styles.title}>{data.planName}</Text>
          <Text style={styles.subtitle}>
            {data.destination.city}, {data.destination.country}
          </Text>
        </View>

        {/* Trip Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TRIP OVERVIEW</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>From:</Text>
              <Text style={styles.value}>
                {data.origin.city}, {data.origin.country}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>To:</Text>
              <Text style={styles.value}>
                {data.destination.city}, {data.destination.country}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Departure:</Text>
              <Text style={styles.value}>
                {new Date(data.departureDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Return:</Text>
              <Text style={styles.value}>
                {new Date(data.returnDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Duration:</Text>
              <Text style={styles.value}>{data.duration} days</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Travelers:</Text>
              <Text style={styles.value}>{totalTravelers} people</Text>
            </View>
          </View>
        </View>

        {/* Emergency Contacts */}
        {data.itinerary.travelInfo?.emergencyContacts && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EMERGENCY CONTACTS</Text>
            <View style={styles.emergencyCard}>
              <View style={styles.row}>
                <Text style={styles.label}>Police:</Text>
                <Text style={styles.value}>
                  {data.itinerary.travelInfo.emergencyContacts.police}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Ambulance:</Text>
                <Text style={styles.value}>
                  {data.itinerary.travelInfo.emergencyContacts.ambulance}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Embassy:</Text>
                <Text style={styles.value}>
                  {data.itinerary.travelInfo.emergencyContacts.embassy}
                </Text>
              </View>
            </View>
          </View>
        )}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Generated by TravelPlanner AI - Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>

      {/* Flights Page */}
      {data.itinerary.flights && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>FLIGHT INFORMATION</Text>

          {/* Outbound Flight */}
          <View style={styles.flightCard}>
            <Text style={styles.cardHeader}>Outbound Flight</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Airline:</Text>
              <Text style={styles.value}>
                {data.itinerary.flights.outbound.airline} -{' '}
                {data.itinerary.flights.outbound.flightNumber}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Departure:</Text>
              <Text style={styles.value}>
                {data.itinerary.flights.outbound.departure.airport} at{' '}
                {data.itinerary.flights.outbound.departure.time}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Arrival:</Text>
              <Text style={styles.value}>
                {data.itinerary.flights.outbound.arrival.airport} at{' '}
                {data.itinerary.flights.outbound.arrival.time}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Duration:</Text>
              <Text style={styles.value}>
                {data.itinerary.flights.outbound.duration}
              </Text>
            </View>
          </View>

          {/* Return Flight */}
          <View style={styles.returnFlightCard}>
            <Text style={styles.cardHeader}>Return Flight</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Airline:</Text>
              <Text style={styles.value}>
                {data.itinerary.flights.return.airline} -{' '}
                {data.itinerary.flights.return.flightNumber}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Departure:</Text>
              <Text style={styles.value}>
                {data.itinerary.flights.return.departure.airport} at{' '}
                {data.itinerary.flights.return.departure.time}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Arrival:</Text>
              <Text style={styles.value}>
                {data.itinerary.flights.return.arrival.airport} at{' '}
                {data.itinerary.flights.return.arrival.time}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Duration:</Text>
              <Text style={styles.value}>
                {data.itinerary.flights.return.duration}
              </Text>
            </View>
          </View>

          {/* Accommodation */}
          {data.itinerary.accommodation && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ACCOMMODATION</Text>
              <View style={styles.accommodationCard}>
                <Text style={styles.cardHeader}>
                  {data.itinerary.accommodation.primary.name}
                </Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Type:</Text>
                  <Text style={styles.value}>
                    {data.itinerary.accommodation.primary.type}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Address:</Text>
                  <Text style={styles.value}>
                    {data.itinerary.accommodation.primary.address}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Check-in:</Text>
                  <Text style={styles.value}>
                    {new Date(
                      data.itinerary.accommodation.primary.checkIn
                    ).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Check-out:</Text>
                  <Text style={styles.value}>
                    {new Date(
                      data.itinerary.accommodation.primary.checkOut
                    ).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Total Cost:</Text>
                  <Text style={styles.value}>
                    {data.budget.currency}{' '}
                    {data.itinerary.accommodation.primary.totalCost.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <Text
            style={styles.footer}
            render={({ pageNumber, totalPages }) =>
              `Generated by TravelPlanner AI - Page ${pageNumber} of ${totalPages}`
            }
            fixed
          />
        </Page>
      )}

      {/* Daily Itinerary Pages */}
      {data.itinerary.dailyItinerary &&
        data.itinerary.dailyItinerary.map((day) => (
          <Page key={day.day} size="A4" style={styles.page}>
            <Text style={styles.sectionTitle}>DAILY ITINERARY</Text>

            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>
                Day {day.day} -{' '}
                {new Date(day.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              {day.theme && <Text style={styles.dayTheme}>{day.theme}</Text>}
            </View>

            {day.activities.slice(0, 6).map((activity, idx) => (
              <View key={idx} style={styles.activity}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                </View>
                <View style={styles.activityDetails}>
                  <View style={styles.activityDetailRow}>
                    <Text style={styles.activityDetailLabel}>Location:</Text>
                    <Text style={styles.activityDetailValue}>
                      {activity.location}
                    </Text>
                  </View>
                  <View style={styles.activityDetailRow}>
                    <Text style={styles.activityDetailLabel}>Duration:</Text>
                    <Text style={styles.activityDetailValue}>
                      {activity.duration}
                    </Text>
                  </View>
                  <View style={styles.activityDetailRow}>
                    <Text style={styles.activityDetailLabel}>Cost:</Text>
                    <Text style={styles.activityDetailValue}>
                      {data.budget.currency} {activity.cost}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {day.activities.length > 6 && (
              <Text style={{ fontSize: 10, color: '#64748b', marginTop: 10 }}>
                ... and {day.activities.length - 6} more activities
              </Text>
            )}

            <View style={styles.dailyTotal}>
              <Text style={styles.dailyTotalLabel}>Daily Total:</Text>
              <Text style={styles.dailyTotalValue}>
                {data.budget.currency} {day.dailyTotal.toLocaleString()}
              </Text>
            </View>

            <Text
              style={styles.footer}
              render={({ pageNumber, totalPages }) =>
                `Generated by TravelPlanner AI - Page ${pageNumber} of ${totalPages}`
              }
              fixed
            />
          </Page>
        ))}

      {/* Budget Summary Page */}
      {data.itinerary.budgetBreakdown && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>BUDGET SUMMARY</Text>

          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Flights</Text>
            <Text style={styles.budgetValue}>
              {data.budget.currency}{' '}
              {data.itinerary.budgetBreakdown.flights.toLocaleString()}
            </Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Accommodation</Text>
            <Text style={styles.budgetValue}>
              {data.budget.currency}{' '}
              {data.itinerary.budgetBreakdown.accommodation.toLocaleString()}
            </Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Food</Text>
            <Text style={styles.budgetValue}>
              {data.budget.currency}{' '}
              {data.itinerary.budgetBreakdown.food.toLocaleString()}
            </Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Activities</Text>
            <Text style={styles.budgetValue}>
              {data.budget.currency}{' '}
              {data.itinerary.budgetBreakdown.activities.toLocaleString()}
            </Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Transportation</Text>
            <Text style={styles.budgetValue}>
              {data.budget.currency}{' '}
              {data.itinerary.budgetBreakdown.transportation.toLocaleString()}
            </Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Shopping</Text>
            <Text style={styles.budgetValue}>
              {data.budget.currency}{' '}
              {data.itinerary.budgetBreakdown.shopping.toLocaleString()}
            </Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={styles.budgetLabel}>Emergency Fund</Text>
            <Text style={styles.budgetValue}>
              {data.budget.currency}{' '}
              {data.itinerary.budgetBreakdown.emergencyFund.toLocaleString()}
            </Text>
          </View>

          <View style={styles.budgetTotal}>
            <View style={styles.budgetTotalRow}>
              <Text style={styles.budgetTotalLabel}>Total Budget</Text>
              <Text style={styles.budgetTotalValue}>
                {data.budget.currency}{' '}
                {data.itinerary.budgetBreakdown.total.toLocaleString()}
              </Text>
            </View>
            <View style={styles.budgetTotalRow}>
              <Text style={styles.budgetTotalLabel}>Per Person</Text>
              <Text style={styles.budgetTotalValue}>
                {data.budget.currency}{' '}
                {data.itinerary.budgetBreakdown.perPerson.toLocaleString()}
              </Text>
            </View>
            <View style={{ ...styles.budgetTotalRow, marginBottom: 0 }}>
              <Text style={styles.budgetTotalLabel}>Daily Average</Text>
              <Text style={styles.budgetTotalValue}>
                {data.budget.currency}{' '}
                {data.itinerary.budgetBreakdown.dailyAverage.toLocaleString()}
              </Text>
            </View>
          </View>

          <Text
            style={styles.footer}
            render={({ pageNumber, totalPages }) =>
              `Generated by TravelPlanner AI - Page ${pageNumber} of ${totalPages}`
            }
            fixed
          />
        </Page>
      )}
    </Document>
  );
};

export async function generateBeautifulPDF(
  planData: TravelPlanData
): Promise<Uint8Array> {
  const buffer = await renderToBuffer(<TravelPlanPDF data={planData} />);
  return new Uint8Array(buffer);
}
