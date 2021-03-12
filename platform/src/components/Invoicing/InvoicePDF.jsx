import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import boomLogo from '../../assets/brand/logo_black.png';
import translations from '../../translations/i18next';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  headerSection: {
    margin: 10,
    padding: 10,
  },
  section: {
    margin: 20,
    marginLeft: 40,
  },
  image: {
    width: '20%',
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  headerTextStyle: {
    fontSize: 10,
    marginLeft: 0,
  },
  row: {
    borderBottomColor: '#bdbdbd',
    borderBottomWidth: 1,
    marginLeft: 40,
    marginRight: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  rowText: {
    fontSize: 12,
    margin: 0,
    marginTop: 5,
    fontWeight: '100',
  },
  totalText: {
    fontSize: 12,
  },
  totalRow: {
    marginTop: 40,
    marginLeft: 40,
    marginRight: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
});

// Create Document Component
const InvoicePDF = ({ title, total, data, currencySymbol }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerSection}>
        <Image style={styles.image} src={boomLogo} />
        <Text style={styles.headerTextStyle}>BOOM Imagestudio</Text>
        <Text style={styles.headerTextStyle}>Corso Magenta 85, Milano - 20123</Text>
      </View>
      <View style={styles.section}>
        <Text>{title}</Text>
      </View>
      <View>
        {_.map(data, (invoiceData) => (
          <View key={invoiceData.id} style={styles.row}>
            <Text style={[styles.rowText, { width: '50%' }]}>{invoiceData.description}</Text>
            <Text style={styles.rowText}>{moment(invoiceData.itemDate).format('L')}</Text>
            <Text style={styles.rowText}>{`${invoiceData.income ? '' : '-'}${invoiceData.amount} ${
              invoiceData.currency && invoiceData.currency.symbol ? invoiceData.currency.symbol : ''
            }`}</Text>
          </View>
        ))}
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalText}>{`${translations.t('invoice.total')} ${total} ${currencySymbol}`}</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
