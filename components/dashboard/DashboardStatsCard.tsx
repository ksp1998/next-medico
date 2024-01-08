"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PlayArrow } from "@mui/icons-material";
import { DashboardSectionProps } from "@/utils/props";
import { apiFetch } from "@/utils/functions";

interface Props {
  card: DashboardSectionProps;
}

const DashboardStatsCard = ({ card }: Props) => {
  const [count, setCount] = useState(card.count ?? 0);

  useEffect(() => {
    const getCount = async () => {
      const { data: res } = await apiFetch(`${card.api}`, { count: 0 });
      const targetCount = res.count;
      const duration = res.count * 200;
      const startTime = performance.now();

      const updateCount = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        const newCount = Math.floor(progress * (targetCount - 1) + 1);
        setCount(newCount);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
    };

    card?.api && getCount();
  }, [card.api]);

  return (
    <div className="col-12 col-sm-6 col-md-4 p-2">
      <Link
        className="d-block text-decoration-none p-4 rounded dashboard-stats"
        href={card.href ?? "#"}
      >
        <div className="text-dark">
          <span className="h4">{"" + count}</span>
          <PlayArrow
            className="text-warning"
            sx={{ fontSize: 24, rotate: "-90deg" }}
          />
          <div className="font-weight-bold">{card.title}</div>
        </div>
      </Link>
    </div>
  );
};

export default DashboardStatsCard;
