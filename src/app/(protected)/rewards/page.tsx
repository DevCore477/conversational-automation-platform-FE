import { Metadata } from "next";

import { Award, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Rewards | Hexa AI",
  description: "Track and manage rewards for successful interactions",
};

// Force dynamic rendering
export const dynamic = "force-dynamic";

/**
 * Rewards Page - Server Component
 *
 * This page displays user rewards and achievements.
 * Currently uses mock data - can be connected to a rewards API when available.
 */
export default async function RewardsPage() {
  // TODO: Connect to rewards API when service is available
  // For now, using mock data structure
  const rewardsData = {
    totalPoints: 12450,
    thisMonth: 1850,
    available: 450,
    recentRewards: [
      {
        id: 1,
        title: "Successful Call",
        description: "Customer appointment booked",
        points: 50,
        timeAgo: "2 hours ago",
      },
      {
        id: 2,
        title: "Campaign Completion",
        description: "Q1 Sales Campaign",
        points: 200,
        timeAgo: "1 day ago",
      },
      {
        id: 3,
        title: "Quality Score",
        description: "High satisfaction rating",
        points: 100,
        timeAgo: "3 days ago",
      },
    ],
  };

  return (
    <main className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Rewards"
        description="Track and manage rewards for successful interactions"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Total Points
            </CardTitle>
            <CardDescription>Overall rewards earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {rewardsData.totalPoints.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-500" />
              This Month
            </CardTitle>
            <CardDescription>Current month rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {rewardsData.thisMonth.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Target: 2,000 points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-500" />
              Available
            </CardTitle>
            <CardDescription>Ready to redeem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {rewardsData.available.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Minimum redemption: 500
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Rewards</CardTitle>
          <CardDescription>Your latest reward activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rewardsData.recentRewards.map((reward) => (
              <div
                key={reward.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium">{reward.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {reward.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+{reward.points}</p>
                  <p className="text-xs text-muted-foreground">
                    {reward.timeAgo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accessible to All Users</CardTitle>
          <CardDescription>
            This page is accessible to both administrators and team members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Team members can view their rewards, track progress, and see
            achievements. This helps motivate the team and recognize excellent
            performance.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
