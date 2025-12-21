"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Star,
  Clock,
  Calculator,
  Smile,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// DESIGN TOKENS FROM FIGMA
// ============================================================================
// Primary dark: #0f172a
// Blue gradient: #1c4ca1
// Teal accent: #28afb0
// Light gray text: #e7e9e9
// Muted gray: #737373
// Dark card bg: #1e293b
// Muted blue: #91aec0
// Footer bg: #0b1c3b
// ============================================================================

// ============================================================================
// ICONS COMPONENTS
// ============================================================================

function ProgressIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M25.2911 29.011H3.47938C3.2147 29.011 2.99989 28.7892 2.99989 28.5159V20.5518C2.99989 20.2784 3.2147 20.0566 3.47938 20.0566H8.45307V18.6495C8.45307 18.3762 8.66788 18.1544 8.93256 18.1544H13.9058V16.1273C13.9058 15.854 14.1206 15.6322 14.3853 15.6322H19.359V12.2084C19.359 11.9351 19.5738 11.7133 19.8384 11.7133H25.2916C25.5563 11.7133 25.7711 11.9351 25.7711 12.2084V28.5163C25.7711 28.7897 25.5563 29.0115 25.2916 29.0115L25.2911 29.011ZM20.3174 28.0207H24.8117V12.703H20.3174V28.0207ZM14.8647 28.0207H19.359V16.6224H14.8647V28.0207ZM9.41204 28.0207H13.9058V19.1446H9.41204V28.0207ZM3.95886 28.0207H8.45307V21.0469H3.95886V28.0207ZM25.0092 9.7481C24.9315 9.7481 24.8534 9.72829 24.7824 9.68918L22.5643 8.45879L20.3467 9.68918C20.1846 9.7788 19.9871 9.76543 19.838 9.65353C19.6888 9.54163 19.6155 9.352 19.6481 9.16484L20.0959 6.60652L18.2777 4.80872C18.1449 4.67751 18.0965 4.47897 18.1531 4.29825C18.2096 4.11752 18.3621 3.98632 18.5443 3.96057L21.0391 3.60952L22.1328 1.26807C22.2929 0.925942 22.8367 0.925942 22.9968 1.26807L24.0905 3.60952L26.5853 3.96057C26.7675 3.98632 26.92 4.11703 26.9765 4.29825C27.0331 4.47946 26.9852 4.67751 26.8519 4.80872L25.0337 6.60652L25.4815 9.16484C25.5141 9.3515 25.4407 9.54163 25.2916 9.65353C25.2082 9.71591 25.1085 9.7481 25.0092 9.7481ZM22.5643 7.4017C22.6425 7.4017 22.7206 7.4215 22.7911 7.46062L24.3605 8.33105L24.0435 6.52087C24.0148 6.35748 24.0675 6.19012 24.1835 6.07525L25.4705 4.80278L23.705 4.55472C23.5453 4.53244 23.4077 4.42896 23.3377 4.27943L22.5638 2.62274L21.7899 4.27943C21.7199 4.42896 21.5818 4.53244 21.4227 4.55472L19.6577 4.80278L20.9446 6.07525C21.0611 6.19012 21.1139 6.35748 21.0846 6.52087L20.7677 8.33105L22.337 7.46062C22.4075 7.42101 22.4866 7.4017 22.5643 7.4017Z" fill="#91AEC0"/>
      <path d="M21.3584 4.06405H21.3632M25.2911 29.011H3.47938C3.2147 29.011 2.99989 28.7892 2.99989 28.5159V20.5518C2.99989 20.2784 3.2147 20.0566 3.47938 20.0566H8.45307V18.6495C8.45307 18.3762 8.66788 18.1544 8.93256 18.1544H13.9058V16.1273C13.9058 15.854 14.1206 15.6322 14.3853 15.6322H19.359V12.2084C19.359 11.9351 19.5738 11.7133 19.8384 11.7133H25.2916C25.5563 11.7133 25.7711 11.9351 25.7711 12.2084V28.5163C25.7711 28.7897 25.5563 29.0115 25.2916 29.0115L25.2911 29.011ZM20.3174 28.0207H24.8117V12.703H20.3174V28.0207ZM14.8647 28.0207H19.359V16.6224H14.8647V28.0207ZM9.41204 28.0207H13.9058V19.1446H9.41204V28.0207ZM3.95886 28.0207H8.45307V21.0469H3.95886V28.0207ZM25.0092 9.7481C24.9315 9.7481 24.8534 9.72829 24.7824 9.68918L22.5643 8.45879L20.3467 9.68918C20.1846 9.7788 19.9871 9.76543 19.838 9.65353C19.6888 9.54163 19.6155 9.352 19.6481 9.16484L20.0959 6.60652L18.2777 4.80872C18.1449 4.67751 18.0965 4.47897 18.1531 4.29825C18.2096 4.11752 18.3621 3.98632 18.5443 3.96057L21.0391 3.60953L22.1328 1.26807C22.2929 0.925942 22.8367 0.925942 22.9968 1.26807L24.0905 3.60953L26.5853 3.96057C26.7675 3.98632 26.92 4.11703 26.9765 4.29825C27.0331 4.47946 26.9852 4.67751 26.8519 4.80872L25.0337 6.60652L25.4815 9.16484C25.5141 9.3515 25.4407 9.54163 25.2916 9.65353C25.2082 9.71591 25.1085 9.7481 25.0092 9.7481ZM22.5643 7.4017C22.6425 7.4017 22.7206 7.4215 22.7911 7.46062L24.3605 8.33105L24.0435 6.52087C24.0148 6.35748 24.0675 6.19012 24.1835 6.07525L25.4705 4.80278L23.705 4.55472C23.5453 4.53244 23.4077 4.42896 23.3377 4.27943L22.5638 2.62274L21.7899 4.27943C21.7199 4.42896 21.5818 4.53244 21.4227 4.55472L19.6577 4.80278L20.9446 6.07525C21.0611 6.19012 21.1139 6.35748 21.0846 6.52087L20.7677 8.33105L22.337 7.46062C22.4075 7.42101 22.4866 7.4017 22.5643 7.4017Z" stroke="#91AEC0" stroke-width="0.2"/>
    </svg>
  );
}

function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
    >
      <path d="M3.3173 28.8462H26.6827C27.2563 28.8456 27.8062 28.6174 28.2118 28.2118C28.6174 27.8062 28.8455 27.2563 28.8461 26.6827V3.31733C28.8455 2.74373 28.6174 2.1938 28.2118 1.78821C27.8062 1.38261 27.2563 1.15448 26.6827 1.15387H3.3173C2.7437 1.15448 2.19377 1.38261 1.78818 1.78821C1.38258 2.1938 1.15445 2.74373 1.15384 3.31733V26.6827C1.15445 27.2563 1.38258 27.8062 1.78818 28.2118C2.19377 28.6174 2.7437 28.8456 3.3173 28.8462ZM2.01922 26.6827V15.4304H14.5673V27.9808H3.3173C2.60192 27.9808 2.01922 27.3981 2.01922 26.6827ZM26.6827 27.9808H15.4327V15.4304H27.9808V26.6827C27.9808 27.3981 27.3981 27.9808 26.6827 27.9808ZM27.9808 3.31733V14.565H15.4327V2.01925H26.6827C27.3981 2.01925 27.9808 2.60195 27.9808 3.31733ZM3.3173 2.01925H14.5673V14.565H2.01922V3.31733C2.01922 2.60195 2.60192 2.01925 3.3173 2.01925Z"
        fill="#91AEC0"
        stroke="#91AEC0"
        stroke-width="0.2"
      />
      <path d="M5.61923 8.72482H7.85942V10.9656C7.85942 11.0803 7.90501 11.1904 7.98615 11.2715C8.0673 11.3527 8.17736 11.3983 8.29211 11.3983C8.40687 11.3983 8.51693 11.3527 8.59807 11.2715C8.67922 11.1904 8.7248 11.0803 8.7248 10.9656V8.72482H10.9656C11.0803 8.72482 11.1904 8.67923 11.2715 8.59809C11.3527 8.51694 11.3983 8.40688 11.3983 8.29213C11.3983 8.17737 11.3527 8.06731 11.2715 7.98617C11.1904 7.90502 11.0803 7.85944 10.9656 7.85944H8.7248V5.61867C8.7248 5.50391 8.67922 5.39385 8.59807 5.31271C8.51693 5.23156 8.40687 5.18597 8.29211 5.18597C8.17736 5.18597 8.0673 5.23156 7.98615 5.31271C7.90501 5.39385 7.85942 5.50391 7.85942 5.61867V7.85944H5.61865C5.50389 7.85944 5.39384 7.90502 5.31269 7.98617C5.23155 8.06731 5.18596 8.17737 5.18596 8.29213C5.18596 8.40688 5.23155 8.51694 5.31269 8.59809C5.39384 8.67923 5.50447 8.72482 5.61923 8.72482ZM23.8996 19.5075C23.8185 19.4265 23.7085 19.381 23.5938 19.381C23.4792 19.381 23.3692 19.4265 23.2881 19.5075L21.7033 21.0917L20.119 19.5075C20.0794 19.465 20.0317 19.4309 19.9786 19.4073C19.9255 19.3836 19.8682 19.3709 19.8101 19.3699C19.752 19.3688 19.6943 19.3795 19.6404 19.4013C19.5865 19.423 19.5376 19.4554 19.4965 19.4965C19.4554 19.5376 19.423 19.5866 19.4013 19.6404C19.3795 19.6943 19.3688 19.752 19.3698 19.8101C19.3709 19.8682 19.3836 19.9255 19.4072 19.9786C19.4309 20.0317 19.465 20.0794 19.5075 20.1191L21.0917 21.7033L19.5075 23.2881C19.465 23.3277 19.4309 23.3755 19.4072 23.4285C19.3836 23.4816 19.3709 23.5389 19.3698 23.597C19.3688 23.6551 19.3795 23.7128 19.4013 23.7667C19.423 23.8206 19.4554 23.8695 19.4965 23.9106C19.5376 23.9517 19.5865 23.9841 19.6404 24.0059C19.6943 24.0276 19.752 24.0383 19.8101 24.0373C19.8682 24.0363 19.9255 24.0235 19.9786 23.9999C20.0317 23.9762 20.0794 23.9421 20.119 23.8996L21.7033 22.3154L23.2881 23.8996C23.3277 23.9421 23.3755 23.9762 23.4285 23.9999C23.4816 24.0235 23.5389 24.0363 23.597 24.0373C23.6551 24.0383 23.7128 24.0276 23.7667 24.0059C23.8206 23.9841 23.8695 23.9517 23.9106 23.9106C23.9517 23.8695 23.9841 23.8206 24.0058 23.7667C24.0276 23.7128 24.0383 23.6551 24.0373 23.597C24.0362 23.5389 24.0235 23.4816 23.9999 23.4285C23.9762 23.3755 23.9421 23.3277 23.8996 23.2881L22.3154 21.7033L23.8996 20.1191C23.9806 20.0379 24.0262 19.9279 24.0262 19.8133C24.0262 19.6986 23.9806 19.5886 23.8996 19.5075ZM19.0298 8.72482H24.3767C24.4915 8.72482 24.6015 8.67923 24.6827 8.59809C24.7638 8.51694 24.8094 8.40688 24.8094 8.29213C24.8094 8.17737 24.7638 8.06731 24.6827 7.98617C24.6015 7.90502 24.4915 7.85944 24.3767 7.85944H19.0298C18.915 7.85944 18.805 7.90502 18.7238 7.98617C18.6427 8.06731 18.5971 8.17737 18.5971 8.29213C18.5971 8.40688 18.6427 8.51694 18.7238 8.59809C18.805 8.67923 18.915 8.72482 19.0298 8.72482ZM10.9656 21.2712H5.61865C5.50389 21.2712 5.39384 21.3168 5.31269 21.3979C5.23155 21.479 5.18596 21.5891 5.18596 21.7039C5.18596 21.8186 5.23155 21.9287 5.31269 22.0098C5.39384 22.091 5.50389 22.1366 5.61865 22.1366H10.9656C11.0803 22.1366 11.1904 22.091 11.2715 22.0098C11.3527 21.9287 11.3983 21.8186 11.3983 21.7039C11.3983 21.5891 11.3527 21.479 11.2715 21.3979C11.1904 21.3168 11.0803 21.2712 10.9656 21.2712ZM8.24019 20.2644H8.34404C8.45879 20.2644 8.56885 20.2188 8.65 20.1377C8.73114 20.0566 8.77673 19.9465 8.77673 19.8317C8.77673 19.717 8.73114 19.6069 8.65 19.5258C8.56885 19.4446 8.45879 19.3991 8.34404 19.3991H8.24019C8.12543 19.3991 8.01538 19.4446 7.93423 19.5258C7.85308 19.6069 7.8075 19.717 7.8075 19.8317C7.8075 19.9465 7.85308 20.0566 7.93423 20.1377C8.01538 20.2188 8.12543 20.2644 8.24019 20.2644ZM8.34461 23.1427H8.24019C8.12543 23.1427 8.01538 23.1883 7.93423 23.2694C7.85308 23.3506 7.8075 23.4606 7.8075 23.5754C7.8075 23.6902 7.85308 23.8002 7.93423 23.8814C8.01538 23.9625 8.12543 24.0081 8.24019 24.0081H8.34404C8.45879 24.0081 8.56885 23.9625 8.65 23.8814C8.73114 23.8002 8.77673 23.6902 8.77673 23.5754C8.77673 23.4606 8.73114 23.3506 8.65 23.2694C8.56885 23.1883 8.45937 23.1427 8.34461 23.1427Z"
        fill="#91AEC0"
        stroke="#91AEC0"
        stroke-width="0.2"
      />
    </svg>
  );
}

function CloudUploadIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M24.0092 10.6425C23.9129 7.5142 21.3878 5 18.2976 5C16.2387 5 14.3274 6.15045 13.3209 7.9628C12.5443 7.57693 11.6863 7.37382 10.8157 7.37382C7.66488 7.37382 5.10139 9.98835 5.10139 13.2021C5.10139 13.2045 5.10139 13.2069 5.10139 13.2098C2.81032 13.3896 1 15.3489 1 17.731C1 20.2315 2.99448 22.2654 5.44605 22.2654C5.53156 22.2654 5.61644 22.263 5.70081 22.2583C5.72544 22.263 5.75088 22.2654 5.77666 22.2654H5.77694L12.5027 22.2607V24.604C12.5027 24.8226 12.6769 25 12.8919 25H17.1081C17.323 25 17.4973 24.8226 17.4973 24.604V22.2565L23.2859 22.2523C26.4365 22.2523 29 19.6377 29 16.4241C29 13.4781 26.8359 11.0075 24.0092 10.6425ZM16.7192 19.4108V24.2074H13.2808V19.4108C13.2808 19.1915 13.1066 19.0141 12.8919 19.0141H11.6105L15 14.8399L18.3898 19.0142H17.1081C16.8934 19.0141 16.7192 19.1915 16.7192 19.4108ZM23.2737 21.459L17.4972 21.4632V19.8074H19.2167C19.3676 19.8074 19.5046 19.7184 19.5687 19.5798C19.6328 19.4406 19.6123 19.2763 19.5163 19.1581L15.2996 13.9648C15.1517 13.7832 14.8483 13.7832 14.7004 13.9648L10.4839 19.1581C10.3878 19.2763 10.3674 19.4406 10.4315 19.5798C10.4956 19.7184 10.6327 19.8074 10.7832 19.8074H12.5027V21.4674L5.88412 21.4722C5.84079 21.4602 5.79541 21.4566 5.74917 21.4596C5.64931 21.468 5.54825 21.4728 5.44605 21.4728C3.42345 21.4728 1.77775 19.7943 1.77775 17.7311C1.77775 15.6679 3.42345 13.9894 5.44605 13.9894L5.49967 13.99C5.60656 13.9912 5.71258 13.9458 5.78723 13.8657C5.86188 13.7851 5.89995 13.6758 5.89206 13.5653C5.88383 13.4452 5.87914 13.324 5.87914 13.2021C5.87914 10.4257 8.09351 8.16714 10.8157 8.16714C11.686 8.16714 12.5411 8.40132 13.2892 8.84455C13.3832 8.90011 13.4957 8.91323 13.5996 8.88041C13.7035 8.84759 13.789 8.77168 13.8356 8.67135C14.6497 6.92295 16.4011 5.79279 18.2975 5.79279C21.0197 5.79279 23.234 8.05188 23.234 10.8278C23.234 10.8827 23.2328 10.9371 23.2311 10.9914C23.2247 11.2053 23.386 11.3863 23.5957 11.3995C26.1902 11.5637 28.2221 13.7702 28.2221 16.4242C28.2222 19.2005 26.0078 21.459 23.2737 21.459Z" fill="#91AEC0" stroke="#91AEC0" stroke-width="0.4"/>
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M25.6667 7.88235H15.3568L13.6797 5.44072C13.3758 4.99711 12.9635 4.6334 12.4795 4.38201C11.9956 4.13063 11.4551 3.99939 10.9063 4H4.33333C3.44956 4.0009 2.60226 4.34205 1.97734 4.94859C1.35242 5.55513 1.00093 6.37752 1 7.2353V22.7647C1.00093 23.6225 1.35242 24.4449 1.97734 25.0514C2.60226 25.6579 3.44956 25.9991 4.33333 26H25.6667C26.5504 25.9991 27.3977 25.6579 28.0227 25.0514C28.6476 24.4449 28.9991 23.6225 29 22.7647V11.1176C28.9991 10.2599 28.6476 9.43749 28.0227 8.83095C27.3977 8.22441 26.5504 7.88326 25.6667 7.88235ZM27.6667 22.7647C27.6661 23.2794 27.4552 23.7728 27.0802 24.1367C26.7053 24.5006 26.1969 24.7053 25.6667 24.7059H4.33333C3.80308 24.7053 3.29471 24.5006 2.91976 24.1367C2.54481 23.7728 2.33391 23.2794 2.33333 22.7647V7.2353C2.33391 6.72064 2.54481 6.22722 2.91976 5.8633C3.29471 5.49938 3.80308 5.29468 4.33333 5.29412H10.9063C11.2356 5.29377 11.5599 5.37252 11.8502 5.52335C12.1405 5.67419 12.3879 5.89242 12.5703 6.15859L14.4453 8.88832C14.5062 8.97694 14.5887 9.04961 14.6855 9.09987C14.7822 9.15014 14.8903 9.17645 15 9.17647H25.6667C26.1969 9.17703 26.7053 9.38173 27.0802 9.74565C27.4552 10.1096 27.6661 10.603 27.6667 11.1176V22.7647ZM19.4714 15.8366C19.5333 15.8967 19.5824 15.968 19.6159 16.0465C19.6494 16.125 19.6666 16.2091 19.6666 16.2941C19.6666 16.3791 19.6494 16.4632 19.6159 16.5417C19.5824 16.6202 19.5333 16.6915 19.4714 16.7516L15.4714 20.6339C15.3456 20.7518 15.1772 20.817 15.0024 20.8155C14.8276 20.8141 14.6604 20.746 14.5368 20.626C14.4132 20.5061 14.3431 20.3438 14.3416 20.1741C14.3401 20.0045 14.4073 19.841 14.5287 19.719L17.3907 16.9412H11C10.8232 16.9412 10.6536 16.873 10.5286 16.7517C10.4036 16.6303 10.3333 16.4657 10.3333 16.2941C10.3333 16.1225 10.4036 15.9579 10.5286 15.8366C10.6536 15.7152 10.8232 15.6471 11 15.6471H17.3907L14.5287 12.8693C14.4072 12.7472 14.34 12.5838 14.3416 12.4141C14.3431 12.2445 14.4132 12.0822 14.5368 11.9622C14.6604 11.8422 14.8276 11.7742 15.0024 11.7727C15.1772 11.7712 15.3456 11.8365 15.4713 11.9543L19.4714 15.8366Z" fill="#91AEC0"/>
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="10"
        height="10"
        rx="2"
        stroke="#91AEC0"
        strokeWidth="2"
      />
      <rect
        x="17"
        y="3"
        width="10"
        height="10"
        rx="2"
        stroke="#91AEC0"
        strokeWidth="2"
      />
      <rect
        x="3"
        y="17"
        width="10"
        height="10"
        rx="2"
        stroke="#91AEC0"
        strokeWidth="2"
      />
      <rect
        x="17"
        y="17"
        width="10"
        height="10"
        rx="2"
        stroke="#91AEC0"
        strokeWidth="2"
      />
    </svg>
  );
}

function ChecklistIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="3"
        width="24"
        height="24"
        rx="3"
        stroke="#91AEC0"
        strokeWidth="2"
      />
      <path
        d="M8 10L11 13L15 8"
        stroke="#91AEC0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 10H22"
        stroke="#91AEC0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 17L11 20L15 15"
        stroke="#91AEC0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 17H22"
        stroke="#91AEC0"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MindIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="15" cy="12" r="9" stroke="#91AEC0" strokeWidth="2" />
      <path
        d="M12 24C12 24 13 21 15 21C17 21 18 24 18 24"
        stroke="#91AEC0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 27H20"
        stroke="#91AEC0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M11 10C11 10 13 8 15 10C17 12 15 14 15 14"
        stroke="#91AEC0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="15" cy="16" r="1" fill="#91AEC0" />
    </svg>
  );
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

function Header() {
  return (
    <header className="flex items-center justify-between w-full max-w-[1180px] mx-auto">
      <div className="relative h-[25px] w-[200px]">
        <Image
          src="/logo-white.svg"
          alt="Darryl Davis Seminars"
          fill
          className="object-contain object-left"
          priority
        />
      </div>
      <Link
        href="/register"
        className="h-[44px] px-5 py-2.5 rounded-[6px] bg-[#28afb0] flex items-center justify-center gap-2.5 hover:bg-[#28afb0]/90 transition-colors"
      >
        <span className="font-[var(--font-open-sans)] font-semibold text-sm text-white capitalize leading-5">
          Get Started
        </span>
      </Link>
    </header>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1c4ca1]" />

      <div className="relative z-10 max-w-[1180px] mx-auto pt-[60px] pb-[80px]">
        <Header />

        <div className="mt-[80px] flex flex-col lg:flex-row gap-10 lg:gap-[80px] items-center justify-between">
          {/* Left content */}
          <div className="w-full lg:max-w-[580px] flex flex-col gap-[40px]">
            <div className="flex flex-col gap-[24px]">
              {/* Badge */}
              <div
                className={cn(
                  "inline-flex self-start items-center gap-[8px] px-[16px] py-[6px] rounded-[20px] bg-[rgba(40,175,176,0.2)] border border-[rgba(40,175,176,0.4)] transition-all duration-700",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
              >
                <Star className="w-[20px] h-[20px] text-[#28afb0] fill-[#28afb0]" />
                <span className="font-[var(--font-poppins)] text-[14px] text-[#28afb0] leading-[28px] tracking-[0.56px]">
                  35+ Years of Real Estate Coaching Excellence
                </span>
              </div>

              {/* Headline */}
              <h1
                className={cn(
                  "font-[var(--font-poppins)] font-bold text-[36px] md:text-[48px] lg:text-[60px] leading-[1.2] text-white transition-all duration-700 delay-100",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
              >
                Your Blueprint for a<br />
                Breakthrough Year
              </h1>

              {/* Description paragraphs */}
              <p
                className={cn(
                  "font-[var(--font-poppins)] text-[16px] leading-[28px] text-[#e7e9e9] transition-all duration-700 delay-200",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
              >
                The interactive business plan that calculates your GCI goal,
                breaks it down into daily activities, and keeps you accountable
                all year long.
              </p>
              <p
                className={cn(
                  "font-[var(--font-poppins)] text-[16px] leading-[28px] text-[#e7e9e9] transition-all duration-700 delay-300",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
              >
                Join thousands of agents using the proven Power Agent
                methodology to design careers and lives worth smiling about.
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className={cn(
                "flex flex-col sm:flex-row gap-[16px] transition-all duration-700 delay-[400ms]",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              )}
            >
              <Link
                href="/register"
                className="h-[44px] px-[20px] py-[10px] rounded-[6px] bg-[#28afb0] flex items-center justify-center gap-[10px] hover:bg-[#28afb0]/90 transition-colors group"
              >
                <span className="font-[var(--font-open-sans)] font-semibold text-[14px] text-white capitalize leading-[20px]">
                  Start Your Plan
                </span>
                <ArrowRight className="w-[24px] h-[24px] text-white group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="h-[44px] px-[20px] py-[10px] rounded-[6px] border border-white flex items-center justify-center gap-[10px] hover:bg-white/10 transition-colors"
              >
                <span className="font-[var(--font-open-sans)] font-semibold text-[14px] text-white capitalize leading-[20px]">
                  Log In
                </span>
              </Link>
            </div>
          </div>

          {/* Right side - App Preview */}
          <div
            className={cn(
              "hidden lg:block relative transition-all duration-1000 delay-500 shrink-0",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            )}
          >
            {/* Blur effect - behind app screenshot */}
            <div className="absolute -inset-[50px] bg-[#1c4ca1] blur-[50px] rounded-full -z-20" />

            {/* Decorative stars */}
            <div className="absolute -top-[60px] -right-[40px] w-[460px] h-[749px] -z-10">
              <Image
                src="/bg-stars-hero.svg"
                alt=""
                fill
                className="object-contain"
              />
            </div>

            {/* App Screenshot - larger to match Figma */}
            <div className="w-[420px] h-[485px] rounded-[12px] overflow-hidden relative z-10">
              <Image
                src="/App-Screenshot-Hero.png"
                alt="MyPlanForSuccess App Preview"
                width={420}
                height={485}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// BENEFITS SECTION
// ============================================================================

const benefits = [
  {
    icon: CalculatorIcon,
    label: "Benefit 1: Know Your Numbers",
    title: "Calculate Your Path to Success",
    description:
      "Enter your expenses and goals. Watch as the plan calculates your GCI target, required transactions, and daily activities automatically. No spreadsheets. No guesswork.",
  },
  {
    icon: FolderIcon,
    label: "Benefit 2: Organize Your Strategy",
    title: "A Complete Roadmap",
    description:
      "From SWOT analysis to prospecting mix, from mindset rituals to accountability contracts—every piece of your business strategy lives in one place.",
  },
  {
    icon: ProgressIcon,
    label: "Benefit 3: Track Your Progress",
    title: "See How Far You've Come",
    description:
      "Track completion across all five sections. Celebrate your wins, identify gaps, and stay motivated with clear progress indicators.",
  },
  {
    icon: CloudUploadIcon,
    label: "Benefit 4: Access Anywhere",
    title: "Plan on Your Schedule",
    description:
      "Whether you're at your desk, on your phone, or between showings, your business plan is always within reach. No printing, no paper, no excuses.",
  },
];

function BenefitsSection() {
  return (
    <section className="bg-[#f8fafc] px-6 md:px-16 lg:px-[130px] py-12 md:py-20">
      <div className="max-w-[1180px] mx-auto">
        <div className="flex flex-col gap-10 md:gap-[60px] items-center">
          {/* Header */}
          <div className="text-center max-w-[800px]">
            <h2 className="font-[var(--font-poppins)] font-bold text-[24px] md:text-[32px] leading-[1.2] text-[#0f172a] mb-4 md:mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="font-[var(--font-poppins)] text-sm md:text-base leading-6 md:leading-7 text-[#737373]">
              The business plan that does the heavy lifting for you. Calculate
              your numbers, track your progress, and stay accountable—all in one
              place.
            </p>
          </div>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-[rgba(145,174,192,0.1)] border border-[rgba(145,174,192,0.2)] rounded-[20px] p-5 md:p-6 flex flex-col sm:flex-row gap-4"
              >
                <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-[#0f172a] rounded-[9px] flex items-center justify-center shrink-0">
                  <benefit.icon className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <p className="font-[var(--font-poppins)] font-medium text-xs md:text-sm text-[#28afb0] uppercase leading-5">
                    {benefit.label}
                  </p>
                  <h3 className="font-[var(--font-poppins)] font-semibold text-lg md:text-xl text-[#0f172a] leading-6 md:leading-7">
                    {benefit.title}
                  </h3>
                  <p className="font-[var(--font-poppins)] font-light text-sm md:text-base text-[#737373] leading-6 md:leading-7">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/register"
            className="h-[44px] px-5 py-2.5 rounded-[6px] bg-[#28afb0] flex items-center justify-center gap-2.5 hover:bg-[#28afb0]/90 transition-colors group"
          >
            <span className="font-[var(--font-open-sans)] font-semibold text-sm text-white capitalize leading-5">
              Get started Free
            </span>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// THREE STEPS SECTION
// ============================================================================

const steps = [
  {
    step: 1,
    title: "Create Your Account",
    description:
      "Sign up in seconds. If you're a Power Agent member, log in with your existing credentials.",
  },
  {
    step: 2,
    title: "Complete Your Plan",
    description:
      "Work through five guided sections at your own pace. From reflection to income planning to accountability, we've got you covered.",
  },
  {
    step: 3,
    title: "Take Action Daily",
    description:
      "Use your personalized numbers as your roadmap. Make your reach-outs. Have your conversations. Hit your goals.",
  },
];

function ThreeStepsSection() {
  return (
    <section className="bg-white px-6 md:px-16 lg:px-[130px] py-12 md:py-20">
      <div className="max-w-[1180px] mx-auto">
        <div className="flex flex-col gap-10 md:gap-[60px] items-center">
          {/* Header */}
          <div className="text-center max-w-[800px]">
            <h2 className="font-[var(--font-poppins)] font-bold text-[24px] md:text-[32px] leading-[1.2] text-[#0f172a] mb-4 md:mb-6">
              Three Steps to Your Best Year Yet
            </h2>
            <p className="font-[var(--font-poppins)] text-sm md:text-base leading-6 md:leading-7 text-[#737373]">
              Your best year doesn&apos;t happen by accident—it happens by
              design. Follow these three steps to build clarity, create
              momentum, and turn your vision into measurable results.
            </p>
          </div>

          {/* Steps */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-5 w-full">
            {steps.map((step) => (
              <div
                key={step.step}
                className="flex-1 bg-white border border-[#e7e9e9] rounded-[20px] p-5 md:p-[30px] overflow-hidden relative"
              >
                {/* Decorative corner elements */}
                <div className="absolute right-[-10px] top-[-10px] w-[58px] h-[58px] rounded-full bg-[#28afb0]/10" />
                <div className="absolute right-[30px] top-[30px] w-[52px] h-[52px] rounded-full bg-[#28afb0]/5" />

                <p className="font-[var(--font-poppins)] font-semibold text-xs md:text-sm text-[rgba(145,174,192,0.6)] uppercase tracking-[1.96px] leading-7 mb-3 md:mb-4">
                  Step {step.step}
                </p>
                <div className="flex flex-col gap-2">
                  <h3 className="font-[var(--font-poppins)] font-semibold text-lg md:text-[22px] text-[#0b1c3b] leading-6 md:leading-7">
                    {step.title}
                  </h3>
                  <p className="font-[var(--font-poppins)] text-sm md:text-base text-[#737373] leading-6 md:leading-7">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/register"
            className="h-[44px] px-5 py-2.5 rounded-[6px] bg-[#28afb0] flex items-center justify-center gap-2.5 hover:bg-[#28afb0]/90 transition-colors group"
          >
            <span className="font-[var(--font-open-sans)] font-semibold text-sm text-white capitalize leading-5">
              Get started Free
            </span>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FIVE SECTIONS OVERVIEW
// ============================================================================

const sections = [
  {
    number: 1,
    title: "Annual Reflection",
    subtitle: "& Intention Setting",
    description:
      "Look back to move forward. Review last year's wins and lessons, then set meaningful intentions for the year ahead. This is where clarity begins.",
    icon: Clock,
  },
  {
    number: 2,
    title: "SWOT",
    subtitle: "Analysis",
    description:
      "Know your strengths. Address your weaknesses. Seize opportunities. Prepare for threats. A clear-eyed assessment of where you stand today.",
    icon: GridIcon,
  },
  {
    number: 3,
    title: "Vision, Goals",
    subtitle: "& Income Planning",
    description:
      "The heart of your business plan. Calculate your expenses, set your income goals, and reverse-engineer the exact daily activities needed to get there.",
    icon: Calculator,
  },
  {
    number: 4,
    title: "Mindset, Self-Care",
    subtitle: "& Motivation",
    description:
      "Your mindset is your engine. Define your affirmations, rituals, boundaries, and support systems that keep you grounded and moving forward.",
    icon: Smile,
    wide: true,
  },
  {
    number: 5,
    title: "Accountability",
    subtitle: "& Progress Tracking",
    description:
      "Turn plans into projects. Define your ideal clients, build your prospecting and marketing mix, and create the systems that keep you on track all year.",
    icon: Shield,
    wide: true,
  },
];

function FiveSectionsOverview() {
  return (
    <section className="relative px-6 md:px-16 lg:px-[130px] py-12 md:py-20 overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-[#0f172a]" />

      {/* Gradient blobs - hidden on mobile */}
      <div className="hidden md:block absolute left-[80px] top-[239px] w-[335px] h-[335px]">
        <div className="absolute inset-[-29.85%] bg-[#1c4ca1] rounded-full blur-[100px] opacity-40" />
      </div>
      <div className="hidden md:block absolute right-[130px] top-[189px] w-[370px] h-[370px]">
        <div className="absolute inset-[-27.03%] bg-[#28afb0] rounded-full blur-[100px] opacity-20" />
      </div>
      <div className="hidden lg:block absolute bottom-[80px] left-[916px] w-[344px] h-[344px]">
        <div className="absolute inset-[-29.07%] bg-[#1c4ca1] rounded-full blur-[100px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-[1180px] mx-auto">
        <div className="flex flex-col gap-10 md:gap-[60px] items-center">
          {/* Header */}
          <div className="text-center max-w-[800px]">
            <h2 className="font-[var(--font-poppins)] font-bold text-[24px] md:text-[32px] leading-[1.2] text-white mb-4 md:mb-6">
              Five Sections. One Complete Business Plan.
            </h2>
            <p className="font-[var(--font-poppins)] text-sm md:text-base leading-6 md:leading-7 text-[#e7e9e9]">
              Build a business plan that works from every angle. These five
              sections guide you through reflection, strategy, goal-setting,
              mindset, and accountability—giving you a complete, actionable
              roadmap for the year ahead.
            </p>
          </div>

          {/* Section cards */}
          <div className="w-full flex flex-col gap-4 md:gap-5">
            {/* Top row - 3 cards (stacked on mobile) */}
            <div className="flex flex-col lg:flex-row gap-4 md:gap-5">
              {sections.slice(0, 3).map((section) => (
                <div
                  key={section.number}
                  className="flex-1 bg-[#1e293b] border border-[rgba(145,174,192,0.2)] rounded-[20px] p-5 md:p-[30px] overflow-hidden relative min-h-[200px] md:min-h-[315px]"
                >
                  {/* Corner decoration */}
                  <div className="absolute right-[-71px] top-[-71px] w-[158px] h-[158px] rounded-full bg-[#28afb0]/10" />

                  {/* Icon */}
                  <div className="absolute right-[15px] md:right-[19px] top-[15px] md:top-[19px] w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
                    <section.icon className="w-full h-full text-[#91aec0]" />
                  </div>

                  <p className="font-[var(--font-poppins)] font-semibold text-xs md:text-sm text-[rgba(145,174,192,0.6)] tracking-[1.96px] leading-7 mb-3 md:mb-4">
                    SECTION {section.number}
                  </p>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-[var(--font-poppins)] text-lg md:text-[22px] leading-6 md:leading-7">
                      <span className="font-semibold text-white">
                        {section.title}
                      </span>{" "}
                      <span className="font-normal text-[#91aec0]">
                        {section.subtitle}
                      </span>
                    </h3>
                    <p className="font-[var(--font-poppins)] text-sm md:text-base text-[#e7e9e9] leading-6 md:leading-7">
                      {section.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom row - 2 wider cards */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-5">
              {sections.slice(3, 5).map((section) => (
                <div
                  key={section.number}
                  className="flex-1 bg-[#1e293b] border border-[rgba(145,174,192,0.2)] rounded-[20px] p-5 md:p-[30px] overflow-hidden relative min-h-[180px] md:min-h-[250px]"
                >
                  {/* Corner decoration */}
                  <div className="absolute right-[-71px] top-[-71px] w-[158px] h-[158px] rounded-full bg-[#28afb0]/10" />

                  {/* Icon */}
                  <div className="absolute right-[15px] md:right-[19px] top-[15px] md:top-[19px] w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
                    <section.icon className="w-full h-full text-[#91aec0]" />
                  </div>

                  <p className="font-[var(--font-poppins)] font-semibold text-xs md:text-sm text-[rgba(145,174,192,0.6)] tracking-[1.96px] leading-7 mb-3 md:mb-4">
                    SECTION {section.number}
                  </p>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-[var(--font-poppins)] text-lg md:text-[22px] leading-6 md:leading-7">
                      <span className="font-semibold text-white">
                        {section.title}
                      </span>{" "}
                      <span className="font-normal text-[#91aec0]">
                        {section.subtitle}
                      </span>
                    </h3>
                    <p className="font-[var(--font-poppins)] text-sm md:text-base text-[#e7e9e9] leading-6 md:leading-7">
                      {section.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/register"
            className="h-[44px] px-5 py-2.5 rounded-[6px] bg-[#28afb0] flex items-center justify-center gap-2.5 hover:bg-[#28afb0]/90 transition-colors group"
          >
            <span className="font-[var(--font-open-sans)] font-semibold text-sm text-white capitalize leading-5">
              Get started Free
            </span>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================

const testimonials = [
  {
    quote:
      "The business plan helped me go from scattered goals to a clear daily roadmap. I closed 30% more transactions this year.",
    author: "Sarah M.",
    role: "RE/MAX Agent, Chicago",
    initials: "SM",
  },
  {
    quote:
      "Having everything calculate automatically and being able to update it on my phone between showings is a game-changer.",
    author: "Michael R.",
    role: "Keller Williams, Austin",
    initials: "MR",
  },
  {
    quote:
      "The SWOT analysis and mindset sections were eye-opening. It's not just about numbers - it's about who you become.",
    author: "Jennifer L.",
    role: "Coldwell Banker, Denver",
    initials: "JL",
  },
];

function TestimonialsSection() {
  return (
    <section className="bg-white px-6 md:px-16 lg:px-[130px] py-12 md:py-20">
      <div className="max-w-[1180px] mx-auto">
        <div className="flex flex-col gap-8 md:gap-[60px]">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="font-[var(--font-poppins)] font-bold text-[24px] md:text-[32px] leading-[1.2] text-[#0f172a]">
              Agents Like You Are Getting Results
            </h2>
            <div className="hidden md:flex gap-5">
              <button className="w-10 h-10 rounded-full border border-[#e7e9e9] flex items-center justify-center hover:bg-[#f8fafc] transition-colors">
                <ArrowRight className="w-5 h-5 text-[#0f172a] rotate-180" />
              </button>
              <button className="w-10 h-10 rounded-full border border-[#e7e9e9] flex items-center justify-center hover:bg-[#f8fafc] transition-colors">
                <ArrowRight className="w-5 h-5 text-[#0f172a]" />
              </button>
            </div>
          </div>

          {/* Testimonial cards */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-5">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-1 bg-white border border-[#e7e9e9] rounded-[20px] p-5 md:p-6 flex flex-col gap-4"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 md:w-5 md:h-5 fill-[#fbbf24] text-[#fbbf24]"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="font-[var(--font-poppins)] text-sm md:text-base text-[#0f172a] leading-6 md:leading-7 flex-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#e7e9e9]">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0f172a]/10 flex items-center justify-center">
                    <span className="font-[var(--font-poppins)] font-semibold text-xs md:text-sm text-[#0f172a]">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-[var(--font-poppins)] font-semibold text-sm text-[#0f172a]">
                      {testimonial.author}
                    </p>
                    <p className="font-[var(--font-poppins)] text-xs md:text-sm text-[#737373]">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ABOUT SECTION (with Darryl)
// ============================================================================

function AboutSection() {
  return (
    <section className="bg-[#f8fafc] px-6 md:px-16 lg:px-[130px] py-12 md:py-20">
      <div className="max-w-[1180px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
          {/* Left - Darryl's photo */}
          <div className="relative w-full max-w-[300px] md:max-w-[400px] shrink-0">
            <div className="relative rounded-[20px] overflow-hidden">
              <Image
                src="/darryl.png"
                alt="Darryl Davis"
                width={400}
                height={500}
                className="w-full h-auto"
              />
            </div>
            {/* Badge */}
            <div className="absolute bottom-4 left-4 bg-[#28afb0] rounded-lg px-3 md:px-4 py-2">
              <p className="font-[var(--font-poppins)] font-bold text-xs md:text-sm text-white">
                35+ Years
              </p>
              <p className="font-[var(--font-poppins)] text-xs text-white/80">
                Coaching Excellence
              </p>
            </div>
          </div>

          {/* Right - Content */}
          <div className="flex flex-col gap-4 md:gap-6">
            <h2 className="font-[var(--font-poppins)] font-bold text-[24px] md:text-[32px] leading-[1.2] text-[#0f172a] text-center lg:text-left">
              Built on Decades of Real Estate Success
            </h2>
            <div className="space-y-3 md:space-y-4">
              <p className="font-[var(--font-poppins)] text-sm md:text-base leading-6 md:leading-7 text-[#737373] text-center lg:text-left">
                MyPlanForSuccess is powered by{" "}
                <strong className="text-[#0f172a]">
                  Darryl Davis Seminars
                </strong>
                , the company behind the Power Agent Program that has helped
                thousands of real estate professionals design careers and lives
                worth smiling about.
              </p>
              <p className="font-[var(--font-poppins)] text-sm md:text-base leading-6 md:leading-7 text-[#737373] text-center lg:text-left">
                For over three decades, Darryl Davis has been coaching agents to
                prospect without fear, list with confidence, and build
                businesses that last. This digital business plan brings that
                proven methodology to your fingertips.
              </p>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-2 md:mt-4">
              {[
                "35+ Years of Real Estate Coaching",
                "Thousands of Agents Coached",
                "Goldman Sachs 10KSB Alumni",
                "Certified Speaking Professional",
              ].map((point, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 md:p-4 bg-white rounded-xl border border-[#e7e9e9]"
                >
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#28afb0] flex items-center justify-center shrink-0">
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="font-[var(--font-poppins)] text-xs md:text-sm text-[#0f172a]">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FINAL CTA SECTION
// ============================================================================

function FinalCTASection() {
  return (
    <section className="bg-white px-6 md:px-16 lg:px-[130px] py-12 md:py-20">
      <div className="max-w-[1180px] mx-auto">
        <div className="bg-gradient-to-r from-[#0f172a] to-[#1c4ca1] rounded-[20px] md:rounded-[30px] px-6 md:px-12 lg:px-20 py-10 md:py-16 text-center">
          <h2 className="font-[var(--font-poppins)] font-bold text-[24px] md:text-[32px] lg:text-[40px] leading-[1.2] text-white mb-4 md:mb-6">
            Ready to Make This Your Breakthrough Year?
          </h2>
          <p className="font-[var(--font-poppins)] text-sm md:text-lg leading-6 md:leading-7 text-[#e7e9e9] mb-6 md:mb-8 max-w-[600px] mx-auto">
            Join thousands of agents using the proven Power Agent methodology.
            Start building your business plan today.
          </p>
          <Link
            href="/register"
            className="inline-flex h-[44px] md:h-[52px] px-6 md:px-8 py-2.5 md:py-3 rounded-[6px] bg-[#28afb0] items-center justify-center gap-2.5 hover:bg-[#28afb0]/90 transition-colors group"
          >
            <span className="font-[var(--font-open-sans)] font-semibold text-sm md:text-base text-white capitalize">
              Start Your Plan Free
            </span>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

function Footer() {
  return (
    <footer className="bg-[#0b1c3b] min-h-[60px] py-4 md:py-0 md:h-[60px] flex items-center justify-center px-6">
      <p className="font-[var(--font-poppins)] text-xs md:text-sm text-white text-center">
        Darryl Davis | Copyright 2025 | Terms &amp; Conditions | Privacy Policy
      </p>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <BenefitsSection />
      <ThreeStepsSection />
      <FiveSectionsOverview />
      <TestimonialsSection />
      <AboutSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
