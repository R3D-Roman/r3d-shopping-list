import {
  transition,
  trigger,
  state,
  style,
  animate,
  useAnimation,
} from "@angular/animations";
import { fadeIn, fadeOut } from "ng-animate";

export const mobileMenuAnime = trigger("menu", [
  state(
    "start",
    style({
      clipPath: "circle(40px at 90% -10%)",
    })
  ),
  state(
    "end",
    style({
      clipPath: "circle(1500px at 90% -10%)",
    })
  ),
  transition("start => end", animate(800)),
  transition("end => start", animate(500)),
]);

export const mobileMenuCloseAnime1 = trigger("close1", [
  state(
    "start",
    style({
      transform: "rotate(0deg) translate(0px, 0px)",
    })
  ),
  state(
    "end",
    style({
      transform: "rotate(-45deg) translate(-5px, 6px)",
    })
  ),
  transition("start => end", animate(500)),
  transition("end => start", animate(500)),
]);

export const mobileMenuCloseAnime2 = trigger("close2", [
  state(
    "start",
    style({
      opacity: 1,
    })
  ),
  state(
    "end",
    style({
      opacity: 0,
    })
  ),
  transition("start => end", animate(300)),
  transition("end => start", animate(300)),
]);

export const mobileMenuCloseAnime3 = trigger("close3", [
  state(
    "start",
    style({
      transform: "rotate(0deg) translate(0px, 0px)",
    })
  ),
  state(
    "end",
    style({
      transform: "rotate(45deg) translate(-5px, -6px)",
    })
  ),
  transition("start => end", animate(500)),
  transition("end => start", animate(500)),
]);

export const deleteListsAnimation = trigger("delete", [
  state(
    "start",
    style({
      transform: "translate(0px, 0px)",
      opacity: 1,
    })
  ),
  state(
    "end",
    style({
      transform: "translateY(8rem) rotateZ(20deg)",
      opacity: 0,
      display: "none"
    })
  ),
  transition("start => end", animate(600)),
]);

export const showMenuForposition = trigger("fadeIn", [
  transition(":enter", useAnimation(fadeIn, {
    params: { timing: 1 }
  })),
]);

export const hideMenuForposition = trigger("fadeOut", [
  transition(
    ":leave",
    useAnimation(fadeOut, {
      params: { timing: 1 },
    })
  ),
]);