// Import necessary Material UI components and dependencies
import Grid from "@mui/material/GridLegacy";
import Divider from "@mui/material/Divider";
import Prayer from "./Prayer";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";

export default function MainContent() {
  // State for API data
  const [data, setdata] = useState([]);
  // State for selected governorate (default: Alexandria)
  const [Governorate, setGovernorate] = useState("alexandria");

  // Get current time
  const time = new Date();
  const hours = time.getHours();
  const minutes = time.getMinutes();

  // State for next prayer and remaining time
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  // Format current date as DD-MM-YYYY
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  // Extract specific prayers only
  const basicPrayers = (({ Fajr, Dhuhr, Asr, Maghrib, Isha }) => ({
    Fajr,
    Dhuhr,
    Asr,
    Maghrib,
    Isha,
  }))(data?.timings || {});

  // Determine upcoming prayer and time left
  useEffect(() => {
    if (!data.timings) return;

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const prayers = Object.entries(basicPrayers).map(
      ([prayerName, timeStr]) => {
        const [hours, minutes] = timeStr.split(":");
        const prayerDate = new Date(
          `${todayStr}T${hours.padStart(2, "0")}:${minutes}:00`
        );
        return { prayerName, prayerDate };
      }
    );

    const upcomingPrayer = prayers.find((p) => p.prayerDate > now);

    if (upcomingPrayer) {
      setNextPrayer(upcomingPrayer);

      const diffMs = upcomingPrayer.prayerDate - now;
      const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(
        `${hoursLeft.toString().padStart(2, "0")}:${minutesLeft
          .toString()
          .padStart(2, "0")}`
      );
    } else {
      setNextPrayer(null);
      setTimeLeft("لا توجد صلاة قادمة لليوم");
    }
  }, [data.timings]);

  // Governorates list with English and Arabic names
  const governorates = [
    { en: "cairo", ar: "القاهرة" },
    { en: "giza", ar: "الجيزة" },
    { en: "alexandria", ar: "الإسكندرية" },
    { en: "sharqia", ar: "الشرقية" },
    { en: "dakahlia", ar: "الدقهلية" },
    { en: "beheira", ar: "البحيرة" },
    { en: "minya", ar: "المنيا" },
    { en: "qalyubia", ar: "القليوبية" },
    { en: "sohag", ar: "سوهاج" },
    { en: "gharbia", ar: "الغربية" },
    { en: "asyut", ar: "أسيوط" },
    { en: "monufia", ar: "المنوفية" },
    { en: "faiyum", ar: "الفيوم" },
    { en: "kafr el sheikh", ar: "كفر الشيخ" },
    { en: "qena", ar: "قنا" },
    { en: "beni suef", ar: "بني سويف" },
    { en: "aswan", ar: "أسوان" },
    { en: "damietta", ar: "دمياط" },
    { en: "ismailia", ar: "الإسماعيلية" },
    { en: "luxor", ar: "الأقصر" },
    { en: "port said", ar: "بورسعيد" },
    { en: "suez", ar: "السويس" },
    { en: "north sinai", ar: "شمال سيناء" },
    { en: "south sinai", ar: "جنوب سيناء" },
    { en: "red sea", ar: "البحر الأحمر" },
    { en: "matrouh", ar: "مطروح" },
    { en: "new valley", ar: "الوادي الجديد" },
  ];

  // Fetch prayer times from API based on selected governorate
  useEffect(() => {
    axios
      .get(
        `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${Governorate}&country=egypt&method=8`
      )
      .then((res) => {
        setdata(res?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [Governorate]);

  // Arabic names for prayer titles
  const prayerNamesAr = {
    Fajr: "الفجر",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
  };

  // Get Arabic name of selected governorate
  const selectedGovernorate = governorates.find(
    (g) => g.en === Governorate
  )?.ar;

  return (
    <>
      {/* Header section with current time and date */}
      <Grid container>
        <Grid item xs={6}>
          <div>
            <h2>
              {`${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}`}{" "}
              | {data?.date?.readable}
            </h2>
            <h1>{selectedGovernorate}</h1>
          </div>
        </Grid>
        <Grid item xs={6}>
          <h2>متبقي علي صلاه {prayerNamesAr[nextPrayer?.prayerName] || ""}</h2>
          <h1>{timeLeft}</h1>
        </Grid>
      </Grid>

      {/* Divider line */}
      <Divider
        variant="middle"
        style={{ borderColor: "white", opacity: "0.2" }}
      />

      {/* Prayer cards section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: "50px",
          gap: "20px",
        }}
      >
        <Prayer
          name={"الفجر"}
          time={data?.timings?.Fajr}
          img={
            "../../public/freepik__the-style-is-candid-image-photography-with-natural__78003.jpeg"
          }
        />
        <Prayer
          name={"الظهر"}
          time={data?.timings?.Dhuhr}
          img={
            "../../public/freepik__the-style-is-candid-image-photography-with-natural__78004.jpeg"
          }
        />
        <Prayer
          name={"العصر"}
          time={data?.timings?.Asr}
          img={
            "../../public/freepik__the-style-is-candid-image-photography-with-natural__78005.jpeg"
          }
        />
        <Prayer
          name={"المغرب"}
          time={data?.timings?.Maghrib}
          img={
            "../../public/freepik__the-style-is-candid-image-photography-with-natural__78006.jpeg"
          }
        />
        <Prayer
          name={"العشاء"}
          time={data?.timings?.Isha}
          img={
            "../../public/freepik__the-style-is-candid-image-photography-with-natural__78007.jpeg"
          }
        />
      </div>

      {/* Governorate selection dropdown */}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-select-small-label" style={{ color: "white" }}>
            المحافظه
          </InputLabel>
          <Select
            color="white"
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={Governorate}
            onChange={(e) => setGovernorate(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {governorates.map((governorate) => (
              <MenuItem
                key={governorate.en}
                value={governorate.en}
                color="white"
                style={{ direction: "ltr" }}
              >
                {governorate.ar}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </>
  );
}
