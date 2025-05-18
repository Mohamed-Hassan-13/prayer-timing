import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";

export default function Prayer({ name, time, img }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia sx={{ height: 140 }} image={img} title="green iguana" />
      <CardContent>
        <h1>{name}</h1>
        <Typography variant="h1" sx={{ color: "text.secondary" }}>
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}
