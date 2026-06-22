import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  smoother.paused(false);
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0a0e17",
    duration: 0.5,
    delay: 1,
  });

  var landingText = new SplitText(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    {
      type: "chars,lines",
      linesClass: "split-line",
    },
  );
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 50, filter: "blur(4px)" },
    {
      opacity: 1,
      duration: 1,
      filter: "blur(0px)",
      ease: "power3.out",
      y: 0,
      stagger: 0.02,
      delay: 0.2,
    },
  );

  const textProps = { type: "words,lines", linesClass: "split-h2" };

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      y: 0,
      delay: 0.6,
    },
  );
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.9,
      ease: "power2.out",
      delay: 0.2,
    },
  );

  var landingPrimary = new SplitText(".landing-h2-1", textProps);
  var landingSecondary = new SplitText(".landing-h2-2", textProps);
  var landingAltPrimary = new SplitText(".landing-h2-info", textProps);
  var landingAltSecondary = new SplitText(".landing-h2-info-1", textProps);

  LoopText(landingPrimary, landingSecondary, { initialDelay: 0.6, hold: 3.2 });
  LoopText(landingAltPrimary, landingAltSecondary, {
    initialDelay: 1,
    hold: 3.2,
  });
}

type LoopOptions = {
  initialDelay?: number;
  hold?: number;
};

function LoopText(
  Text1: SplitText,
  Text2: SplitText,
  options: LoopOptions = {},
) {
  const hold = options.hold ?? 2.8;
  const initialDelay = options.initialDelay ?? 0;
  const text1Targets = getSplitTargets(Text1);
  const text2Targets = getSplitTargets(Text2);
  gsap.set([text1Targets, text2Targets], { autoAlpha: 0, y: 18 });

  var tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 0.8,
    delay: initialDelay,
  });

  tl.fromTo(
    text1Targets,
    { autoAlpha: 0, y: 18 },
    {
      autoAlpha: 1,
      duration: 0.7,
      ease: "power2.out",
      y: 0,
      stagger: 0.04,
    },
  )
    .to(
      text1Targets,
      {
        autoAlpha: 0,
        y: -18,
        duration: 0.6,
        ease: "power2.in",
        stagger: 0.04,
      },
      `+=${hold}`,
    )
    .fromTo(
      text2Targets,
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        duration: 0.7,
        ease: "power2.out",
        y: 0,
        stagger: 0.04,
      },
      "<0.2",
    )
    .to(
      text2Targets,
      {
        autoAlpha: 0,
        y: -18,
        duration: 0.6,
        ease: "power2.in",
        stagger: 0.04,
      },
      `+=${hold}`,
    );
}

function getSplitTargets(split: SplitText) {
  return split.words && split.words.length ? split.words : split.chars;
}
