import { type FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const Dashboard: FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Your Campaigns</CardTitle>
      <CardDescription>Manage your D&D campaigns and lore</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">
        This is where your D&D campaigns and lore will be displayed. We'll add
        more features soon!
      </p>
    </CardContent>
  </Card>
);
export default Dashboard;
