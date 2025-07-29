import dateFormat from "dateformat";

import {
  Img,
  Row,
  Body,
  Head,
  Html,
  Text,
  Column,
  Preview,
  Heading,
  Section,
  Tailwind,
  Container,
} from "@react-email/components";

import { Order } from "@/types";
import { SERVER_URL } from "@/lib/constants";

interface EmailTemplateProps {
  order: Order;
}

export default function PurchaseReceiptEmailTemplate({ order }: EmailTemplateProps) {
  const subtotal = order.items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
  return (
    <Html>
      <Preview>View order receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans">
          <Container>
            <Heading>Purchase Receipt</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Order ID
                  </Text>
                  <Text className="mt-0 mr-4">{order.id}</Text>
                </Column>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Purchase Date
                  </Text>
                  <Text className="mt-0 mr-4">{dateFormat(order.createdAt, "mmm d, yyyy")}</Text>
                </Column>
                <Column>
                  <Text className="mb-0 mr-4 text-end text-gray-500 whitespace-nowrap text-nowrap">
                    Price Paid
                  </Text>
                  <Text className="mt-0 mr-4 text-end font-semibold">$ {order.totalPrice}</Text>
                </Column>
              </Row>
            </Section>
            <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6">
              {order.items.map((item) => (
                <Row key={item.productId} className="mb-8">
                  <Column className="w-20">
                    <Img
                      className="rounded w-18"
                      width={70}
                      height={70}
                      src={
                        item.image?.startsWith("/")
                          ? `${SERVER_URL}${item.image}`
                          : item.image || ""
                      }
                      alt={item.name}
                    />
                  </Column>
                  <Column className="align-middle">
                    <Text>
                      {item.name} x {item.quantity}
                    </Text>
                  </Column>
                  <Column className="align-middle">
                    <Text>{item.quantity}</Text>
                  </Column>
                  <Column align="right" className="align-middle">
                    <Text>$ {(Number(item.price) * item.quantity).toFixed(2)}</Text>
                  </Column>
                </Row>
              ))}
              {[
                { label: "Subtotal", value: subtotal.toFixed(2) },
                { label: "Shipping", value: order.shippingPrice },
                { label: "Tax", value: order.taxPrice },
                { label: "Total", value: order.totalPrice },
              ].map((item) => (
                <Row key={item.label} className="mt-2">
                  <Column align="right" className="font-light">
                    {item.label}:
                  </Column>
                  <Column align="right" className="w-16 font-medium align-middle">
                    <Text className="m-0">$ {item.value}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

// This information it's only for preview the email template
PurchaseReceiptEmailTemplate.PreviewProps = {
  order: {
    id: "qwlsdnklsd-21213-sd-21df-sdfq",
    createdAt: new Date(),
    totalPrice: "192.12",
    shippingPrice: "10.00",
    taxPrice: "21.00",
    items: [
      {
        productId: "123",
        name: "Buzo Ultra Piola Color Sailmon",
        image: "https://utfs.io/f/jW4VufCIhGmTavvRcsHBdwCxXDyMWkFQhusq0eSIoT8VKbcE",
        price: "59.99",
        quantity: 2,
      },
      {
        productId: "123",
        name: "Buzo Piola Normal Color Sailmon",
        image: "https://utfs.io/f/jW4VufCIhGmTavvRcsHBdwCxXDyMWkFQhusq0eSIoT8VKbcE",
        price: "12.99",
        quantity: 5,
      },
    ],
    user: {
      name: "Juan Carlos",
      email: "user@example.com",
    },
  },
};
