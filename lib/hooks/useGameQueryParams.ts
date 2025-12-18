"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_DIFFICULTY, type Difficulty } from "@/lib/constants";

export function useGameQueryParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const replaceWithParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const query = params.toString();
    if (query) {
      router.replace(`?${query}`);
    } else {
      router.replace("/play");
    }
  };

  const setDifficultyParam = (difficulty: Difficulty) => {
    replaceWithParams((params) => {
      if (difficulty === DEFAULT_DIFFICULTY) {
        params.delete("difficulty");
      } else {
        params.set("difficulty", difficulty);
      }
    });
  };

  const setModeClassic = () => {
    replaceWithParams((params) => {
      params.delete("mode");
      params.delete("t");
    });
  };

  const setModeLimited = () => {
    replaceWithParams((params) => {
      params.set("mode", "limited");
      params.delete("t");
    });
  };

  const setModeTimeAttack = (durationSec?: number) => {
    replaceWithParams((params) => {
      params.set("mode", "time-attack");
      if (durationSec && durationSec > 0) {
        params.set("t", String(durationSec));
      } else {
        params.delete("t");
      }
    });
  };

  return {
    setDifficultyParam,
    setModeClassic,
    setModeLimited,
    setModeTimeAttack,
  };
}


