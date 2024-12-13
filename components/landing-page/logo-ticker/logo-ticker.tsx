'use client'
import { motion } from "framer-motion";

import AnalyticsLogo from "./logos/analytics";
import PhoneLogo from "./logos/phone";
import InstantLogo from "./logos/instant-insights";
import DetailedReportsLogo from "./logos/detailed-reports";
import ActionableDataLogo from "./logos/actionable-data";
import TrendAnalysisLogo from "./logos/trend-analysis";
import AthleteComparisonLogo from "./logos/athlete-comparison";

export default function LogoTicker() {
    return (
        <section className="py-8 md:py-12 max-w-full">
            <div className="container max-w-full">
                <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
                    <motion.div 
                        className="flex flex-none gap-16 pr-16"
                        animate={{
                            translateX: "-50%",
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                    >
                        <AnalyticsLogo />
                        <PhoneLogo />
                        <InstantLogo />
                        <DetailedReportsLogo />
                        <ActionableDataLogo />
                        <TrendAnalysisLogo />
                        <AthleteComparisonLogo />

                        {/* Second set of logos for animation */}
                        <AnalyticsLogo />
                        <PhoneLogo />
                        <InstantLogo />
                        <DetailedReportsLogo />
                        <ActionableDataLogo />
                        <TrendAnalysisLogo />
                        <AthleteComparisonLogo />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}