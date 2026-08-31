"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis,} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type AgentPerformance,
  type FlowPerformance,
  type ScriptPerformance,
  type CallVolumeByResourceResponse,
  type PerformanceUsageSeries,
} from "@/types/dashboard.types";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { usePeriodStore, type Period } from "@/store/period.store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const chartConfig = {
  success: {
    label: "Success",
    color: "#22c55e",
  },
  failed: {
    label: "Failed",
    color: "#ef4444",
  },
  active: {
    label: "Active",
    color: "#3b82f6",
  },
  retry: {
    label: "Retry",
    color: "#f59e0b",
  },
  total: {
    label: "Total",
    color: "#8b5cf6",
  },
} satisfies ChartConfig;

const overallChartConfig = {
  agent: {
    label: "Agent",
    color: "#3b82f6",
  },
  conversationFlow: {
    label: "Flow",
    color: "#22c55e",
  },
  script: {
    label: "Script",
    color: "#f59e0b",
  },
  other: {
    label: "Custom Scripts",
    color: "#8b5cf6",
  },
} satisfies ChartConfig;

interface CallAnalyticsProps {
  agents: AgentPerformance[];
  flows: FlowPerformance[];
  scriptPerf: ScriptPerformance[];
  initialCallVolume: CallVolumeByResourceResponse | null;
}

export function CallAnalytics({
  agents,
  flows,
  scriptPerf,
  initialCallVolume,
}: CallAnalyticsProps) {
  const { period: globalPeriod } = usePeriodStore();

  const [activeTab, setActiveTab] = useState("agent");
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [selectedFlow, setSelectedFlow] = useState<string>("");
  const [selectedScript, setSelectedScript] = useState<string>("");
  // const { period, setPeriod } = usePeriodStore();
  // const [period, setPeriod] = useState<"hour" | "day" | "week" | "month">("month");
  const [localPeriod, setLocalPeriod] = useState<"hour" | "day" | "week" | "month" | null>(null); // 👈 null means "use global"

  const [callVolume, setCallVolume] = useState<CallVolumeByResourceResponse | null>(initialCallVolume);
  const [agentUsage, setAgentUsage] = useState<PerformanceUsageSeries | null>(null);
  const [flowUsage, setFlowUsage] = useState<PerformanceUsageSeries | null>(null);
  const [scriptUsage, setScriptUsage] = useState<PerformanceUsageSeries | null>(null);

  const period = localPeriod ?? globalPeriod ?? "month";

    useEffect(() => {
    setLocalPeriod(null);
  }, [globalPeriod]);

  const fetchCallVolume = useCallback(
    async (selectedPeriod: "hour" | "day" | "week" | "month") => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? "https://api.gethexa.ai"}/dashboard-stats/calls/volume/by-resource?period=${selectedPeriod}`,
          {
            headers: {
              Authorization: `Bearer ${document.cookie.split("auth-token=")[1]?.split(";")[0]}`,
            },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setCallVolume(data);
        }
      } catch (error) {
        console.error("[fetchCallVolume] Error:", error);
      }
    },
    [],
  );

  const fetchUsageForResource = useCallback(
    async (
      resourceType: "agents" | "flows" | "scripts",
      selectedId: string,
      selectedPeriod: "hour" | "day" | "week" | "month",
    ) => {
      try {
        const resourceIdParam = resourceType.slice(0, -1) + "Id";
        const url = `${process.env.NEXT_PUBLIC_API_URL ?? "https://api.gethexa.ai"}/dashboard-stats/${resourceType}/performance?period=${selectedPeriod}&${resourceIdParam}=${selectedId}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${document.cookie.split("auth-token=")[1]?.split(";")[0]}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch (error) {
        console.error("[fetchUsageForResource] Error:", error);
      }
      return null;
    },
    [],
  );

  useEffect(() => {
    if (activeTab === "overall") {
      void fetchCallVolume(period);
    }
  }, [activeTab, period, fetchCallVolume]);

  useEffect(() => {
    const fetchUsage = async () => {
      let resourceType: "agents" | "flows" | "scripts";
      let selectedId: string;
      let setter: (data: PerformanceUsageSeries | null) => void;

      switch (activeTab) {
        case "agent":
          resourceType = "agents";
          selectedId = selectedAgent;
          setter = setAgentUsage;
          break;
        case "flow":
          resourceType = "flows";
          selectedId = selectedFlow;
          setter = setFlowUsage;
          break;
        case "scripts":
          resourceType = "scripts";
          selectedId = selectedScript;
          setter = setScriptUsage;
          break;
        default:
          return;
      }

      if (selectedId) {
        const data = await fetchUsageForResource(resourceType, selectedId, period);
        setter(data?.usage || null);
      }
    };

    void fetchUsage();
  }, [activeTab, selectedAgent, selectedFlow, selectedScript, period, fetchUsageForResource]);

  const agentData = useMemo(() => {
    return agents.map((a) => ({
      id: a.id,
      name: a.agentName,
      calls: a.totalCalls,
      success: a.successfulCalls,
      failed: a.failedCalls,
      active: a.activeCalls,
      retry: a.retriedCalls,
      successRate: a.successRate,
    }));
  }, [agents]);

  const flowData = useMemo(() => {
    return flows.map((f) => ({
      id: f.id,
      name: f.name,
      calls: f.totalCalls,
      success: f.successfulCalls,
      failed: f.failedCalls,
      active: f.activeCalls,
      retry: f.retriedCalls,
      successRate: f.successRate,
    }));
  }, [flows]);

  const scriptData = useMemo(() => {
    return (scriptPerf || []).map((s: ScriptPerformance) => ({
      id: s.id,
      name: s.name,
      calls: s.totalCalls,
      success: s.successfulCalls,
      failed: s.failedCalls,
      active: s.activeCalls,
      retry: s.retriedCalls,
      successRate: s.successRate,
    }));
  }, [scriptPerf]);

  // Set default selected values when data changes
  useEffect(() => {
    if (agentData.length > 0 && !selectedAgent) {
      setSelectedAgent(agentData[0].id);
    }
    if (flowData.length > 0 && !selectedFlow) {
      setSelectedFlow(flowData[0].id);
    }
    if (scriptData.length > 0 && !selectedScript) {
      setSelectedScript(scriptData[0].id);
    }
  }, [agentData, flowData, scriptData]);

  const currentData =
    activeTab === "agent"
      ? agentData
      : activeTab === "flow"
        ? flowData
        : scriptData;

  // Add this useEffect to handle tab switching
  useEffect(() => {
    if (currentData.length === 0) return;

    const selectedValue =
      activeTab === "agent"
        ? selectedAgent
        : activeTab === "flow"
          ? selectedFlow
          : selectedScript;

    const exists = currentData.some((d) => d.id === selectedValue);

    if (!exists) {
      if (activeTab === "agent") setSelectedAgent(currentData[0].id);
      else if (activeTab === "flow") setSelectedFlow(currentData[0].id);
      else if (activeTab === "scripts") setSelectedScript(currentData[0].id);
    }
  }, [activeTab, currentData]);

  // Then update selectedItemData to fallback gracefully
  const selectedItemData = useMemo(() => {
    const selectedValue =
      activeTab === "agent"
        ? selectedAgent
        : activeTab === "flow"
          ? selectedFlow
          : selectedScript;

    return currentData.find((d) => d.id === selectedValue) || currentData[0];
  }, [currentData, activeTab, selectedAgent, selectedFlow, selectedScript]);

  const totalSuccess = selectedItemData?.success ?? 0;
  const totalFailed = selectedItemData?.failed ?? 0;
  const totalActive = selectedItemData?.active ?? 0;
  const totalRetry = selectedItemData?.retry ?? 0;
  const totalCalls = totalSuccess + totalFailed + totalActive + totalRetry;
  const successRate = selectedItemData ? selectedItemData.successRate.toFixed(1) : "0";

  const currentUsage = useMemo(() => {
    if (activeTab === "agent") return agentUsage;
    if (activeTab === "flow") return flowUsage;
    if (activeTab === "scripts") return scriptUsage;
    return null;
  }, [activeTab, agentUsage, flowUsage, scriptUsage]);

  const usageChartData = useMemo(() => {
    if (!currentUsage?.data) return [];
    return currentUsage.data.map((bucket) => ({
      timestamp: bucket.timestamp,
      success: bucket.completed,
      failed: bucket.failed,
      active: bucket.active,
      retry: bucket.retried,
      total: bucket.total,
    }));
  }, [currentUsage]);

  // Get the appropriate selected value and setter based on active tab
  const emptyMessage =
    activeTab === "agent" ? "agent" : activeTab === "flow" ? "flow" : "script";

  const hasAnyData =
    totalSuccess > 0 || totalFailed > 0 || totalActive > 0 || totalRetry > 0;

  const getSelectedValue = () => {
    switch (activeTab) {
      case "agent":
        return selectedAgent;
      case "flow":
        return selectedFlow;
      case "scripts":
        return selectedScript;
      default:
        return "";
    }
  };

  const getSetSelectedValue = (value: string) => {
    switch (activeTab) {
      case "agent":
        setSelectedAgent(value);
        break;
      case "flow":
        setSelectedFlow(value);
        break;
      case "scripts":
        setSelectedScript(value);
        break;
    }
  };

  const truncateText = (text: string, maxLength: number = 20) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  // Get the selected item name
  const getSelectedItemName = () => {
    const selectedId = getSelectedValue();
    const selectedItem = currentData.find(item => item.id === selectedId);
    return selectedItem ? selectedItem.name : "";
  };
  const selectedName = getSelectedItemName();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="">
      {/* <div className="bg- dark:bg-[#666666] rounded-t-2xl overflow-hidden"> */}
      <TabsList className="hidden lg:grid w-full grid-cols-1 lg:grid-cols-4 p-0.5 bg-background">
        <TabsTrigger className="rounded-tl-xl" value="agent">Agent Performance</TabsTrigger>
        <TabsTrigger value="flow">Flow Performance</TabsTrigger>
        <TabsTrigger value="scripts">Scripts Performance</TabsTrigger>
        <TabsTrigger className="rounded-b-x lg:rounded-tr-xl" value="overall">Overall Performance</TabsTrigger>
      </TabsList>

      <TabsList className="grid lg:hidden w-full grid-cols-4 p-0.5 bg-background">
        <TabsTrigger className="rounded-tl-xl" value="agent">Agent</TabsTrigger>
        <TabsTrigger value="flow">Flow</TabsTrigger>
        <TabsTrigger value="scripts">Scripts</TabsTrigger>
        <TabsTrigger className="rounded-tr-xl" value="overall">Overall</TabsTrigger>
      </TabsList>
      {/* </div> */}

      {(["agent", "flow", "scripts"] as const).map((tab) => (
        <TabsContent key={tab} value={tab} className="space-y-4">
          <Card className="rounded-t-none!">
            <CardHeader>
              <div className="flex flex-col lg:flex-row gap-2 lg:items-center justify-between">
                <div>
                  <CardTitle className="lg:text-lg 4xl:text-xl mb-1">Call Performance</CardTitle>
                  <CardDescription className="text-xs 2xl:text-sm">
                    Breakdown of Calls performance over time
                  </CardDescription>
                </div>
                <div className="flex items-center gap-">
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span className="text-sm text-muted-foreground">Success</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-danger-soft"></div>
                      <span className="text-sm text-muted-foreground">Failed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-blue"></div>
                      <span className="text-sm text-muted-foreground">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning"></div>
                      <span className="text-sm text-muted-foreground">Retry</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={getSelectedValue()}
                    onValueChange={getSetSelectedValue}
                  >
                    {/* <SelectTrigger className="w-[180px]">
                      <SelectValue>
                        {truncateText(getSelectedItemName(), 12)}
                      </SelectValue>
                    </SelectTrigger> */}
                    <SelectTrigger className="w-[180px]">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate block w-full text-start">
                              {truncateText(selectedName, 12)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="w-full max-w-60">
                            {selectedName}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </SelectTrigger>
                    <SelectContent >
                      {currentData.map((item) => (
                        <SelectItem key={item.id} value={item.id} >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="truncate block w-full text-start">
                                  {truncateText(item.name, 15)}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="w-full max-w-60">
                                {item.name}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-purple-100 border-purple-300 hover:bg-purple-200 dark:bg-purple-900 dark:border-purple-600 dark:hover:bg-purple-800"
                      >
                        <Filter className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setLocalPeriod("hour")}>
                        Hour
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLocalPeriod("day")}>
                        Day
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLocalPeriod("week")}>
                        Week
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLocalPeriod("month")}>
                        Month
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  </div>

                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!currentUsage?.data || usageChartData.length === 0 ? (
                <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                  No call data found for this {emptyMessage}
                </div>
              ) : (
                <>
                <ChartContainer
                  config={chartConfig}
                  className="h-[250px] w-full"
                >
                  <AreaChart data={usageChartData}>
                    <defs>
                      <linearGradient id="fillSuccess" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="fillFailed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="fillRetry" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="timestamp"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value: any) => {
                          const date = new Date(value);
                          if (period === "hour") {
                            return date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            });
                          }
                          if (period === "day") {
                            return date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            });
                          }
                          return date.toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            indicator="line"
                            labelFormatter={(value: any) =>
                              new Date(value).toLocaleString()
                            }
                          />
                        }
                      />
                      <Area
                        type="monotone" 
                        dataKey="success" 
                        stroke="#22c55e" 
                        fill="url(#fillSuccess)" 
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="failed"
                        stroke="#ef4444"
                        fill="url(#fillFailed)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="active"
                        stroke="#3b82f6"
                        fill="url(#fillActive)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="retry"
                        stroke="#f59e0b"
                        fill="url(#fillRetry)"
                        strokeWidth={2}
                      />
                  </AreaChart>
                </ChartContainer>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      ))}

      <TabsContent value="overall" className="space-y-4">
        {callVolume && callVolume.data.length > 0 ? (
          <>
            <Card className="rounded-t-none!">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex flex-col gap-1">
                    <CardTitle>Call Volume Over Time</CardTitle>
                    <CardDescription>
                      Breakdown by resource type across the selected period
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-x-4 gap-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-blue"></div>
                        <span className="text-sm text-muted-foreground">Agent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span className="text-sm text-muted-foreground">Flow</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-warning"></div>
                        <span className="text-sm text-muted-foreground">Script</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#8b5cf6]"></div>
                        <span className="text-sm text-muted-foreground">Custom Scripts</span>
                      </div>
                    </div>
                    <div className="hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-purple-100 border-purple-300 hover:bg-purple-200 dark:bg-purple-900 dark:border-purple-600 dark:hover:bg-purple-800"
                        >
                          <Filter className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setLocalPeriod("hour")}>
                          Hour
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLocalPeriod("day")}>
                          Day
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLocalPeriod("week")}>
                          Week
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLocalPeriod("month")}>
                          Month
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={overallChartConfig}
                  className="h-[300px] w-full"
                >
                  <AreaChart data={callVolume.data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="timestamp"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value: any) => {
                        const date = new Date(value);
                        if (period === "hour") {
                          return date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                        }
                        if (period === "day") {
                          return date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                        }
                        return date.toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          indicator="dot"
                          labelFormatter={(value: any) => {
                            const date = new Date(value);
                            return date.toLocaleString();
                          }}
                        />
                      }
                    />
                    <defs>
                      <linearGradient
                        id="fillAgent"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient id="fillFlow" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#22c55e"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#22c55e"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillScript"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f59e0b"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f59e0b"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillOther"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="agent"
                      stroke="#3b82f6"
                      fill="url(#fillAgent)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="conversationFlow"
                      stroke="#22c55e"
                      fill="url(#fillFlow)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="script"
                      stroke="#f59e0b"
                      fill="url(#fillScript)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="other"
                      stroke="#8b5cf6"
                      fill="url(#fillOther)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="flex h-[300px] items-center justify-center text-muted-foreground">
              No call volume data available for the selected period
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
