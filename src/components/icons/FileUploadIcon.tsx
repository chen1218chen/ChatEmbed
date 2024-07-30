import { JSX } from 'solid-js/jsx-runtime';
const defaultButtonColor = '#3B81F6';
export const FileUploadIcon = (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     class="icon icon-tabler icon-tabler-file-upload"
//     width="20"
//     style={{ fill: props.color ?? defaultButtonColor }}
//     {...props}
//     height="24" 
//     viewBox="0 0 24 24" 
//     stroke-width="1.5" 
//     stroke="#3b81f6" 
//     fill="none" 
//     stroke-linecap="round" 
//     stroke-linejoin="round">
//     <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
//     <path d="M14 3v4a1 1 0 0 0 1 1h4" />
//     <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
//     <path d="M12 11v6" />
//     <path d="M9.5 13.5l2.5 -2.5l2.5 2.5" />
// </svg>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    class="icon icon-tabler icon-tabler-file-upload"
    width="20"
    style={{ fill: props.color ?? defaultButtonColor }}
    {...props}
    height="24" 
    viewBox="0 0 24 24" 
    stroke="#3b81f6" 
    fill="none" 
    stroke-linecap="round" 
    stroke-linejoin="round"
    >
    <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6z" />
  </svg>
);
