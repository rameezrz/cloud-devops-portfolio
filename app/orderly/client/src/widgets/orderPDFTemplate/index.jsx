import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import dayjs from "dayjs";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#374151",
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
    color: "#4B5563",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  column: {
    flexDirection: "column",
    flexGrow: 1,
  },
  label: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    color: "#111827",
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 10,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    borderBottomColor: "#4B5563",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#F3F4F6",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    color: "#4B5563",
  },
  image: {
    width: 40,
    height: 40,
    objectFit: "cover",
    marginRight: 5,
  },
  summary: {
    marginTop: 20,
    borderTop: 1,
    borderColor: "#E5E7EB",
    paddingTop: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#4B5563",
    width: 100,
  },
  summaryValue: {
    fontSize: 12,
    color: "#111827",
    width: 100,
    textAlign: "right",
  },
  summaryTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
});

export const OrderPDFTemplate = ({ orderData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Purchase Order</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Order No</Text>
            <Text style={styles.value}>{orderData.orderNo}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Order Date</Text>
            <Text style={styles.value}>
              {dayjs(orderData.orderDate).format("MMMM D, YYYY")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheader}>Supplier Details</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Supplier Name</Text>
            <Text style={styles.value}>{orderData.supplier.supplierName}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Supplier No</Text>
            <Text style={styles.value}>{orderData.supplier.supplierNo}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{orderData.supplier.address}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Country</Text>
            <Text style={styles.value}>{orderData.supplier.country}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Tax No</Text>
            <Text style={styles.value}>{orderData.supplier.taxNo}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Mobile</Text>
            <Text style={styles.value}>{orderData.supplier.mobileNo}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{orderData.supplier.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheader}>Order Items</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Item</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Qty</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Unit Price</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Discount</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Net Amount</Text>
            </View>
          </View>
          {orderData.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.item.itemImages && item.item.itemImages.length > 0 && (
                    <Image style={styles.image} src={item.item.itemImages[0]} />
                  )}
                  <View>
                    <Text style={styles.tableCell}>{item.item.itemName}</Text>
                    <Text
                      style={[
                        styles.tableCell,
                        { color: "#9CA3AF", fontSize: 8 },
                      ]}
                    >
                      {item.item.itemNo}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {item.orderQty} {item.item.stockUnit}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  ${item.item.unitPrice.toFixed(2)}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  ${item.discount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  ${item.netAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Item Total:</Text>
          <Text style={styles.summaryValue}>
            ${orderData.itemTotal.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Discount Total:</Text>
          <Text style={styles.summaryValue}>
            ${orderData.discountTotal.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, styles.summaryTotal]}>
            Net Amount:
          </Text>
          <Text style={[styles.summaryValue, styles.summaryTotal]}>
            ${orderData.netAmount.toFixed(2)}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);
