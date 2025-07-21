"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const chartConfig = {
  sales: {
    label: "Total Sales $",
  },
} satisfies ChartConfig;

const DAYS_TIME_RANGES: Record<string, number> = {
  "30d": 30,
  "7d": 7,
  "3d": 3,
};

export function Chart({ data }: { data: { date: string; totalSales: number }[] }) {
  const [timeRange, setTimeRange] = React.useState("30d");

  const filteredData = data.filter((item) => {
    const dataDate = new Date(item.date);
    const referenceDate = Date.now();
    const startDate = new Date(referenceDate);

    const daysToSubtract = DAYS_TIME_RANGES[timeRange] || 30;
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return dataDate >= startDate;
  });

  return (
    <Card className="py-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>Showing total sales for the last 30 days</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="3d" className="rounded-lg">
              Last 3 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={5}
              tickFormatter={(value) => `$ ${value}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[175px]"
                  nameKey="sales"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar radius={3} dataKey="totalSales" className="fill-sky-400 dark:fill-sky-800" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
