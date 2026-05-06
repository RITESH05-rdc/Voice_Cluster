declare module 'plotly.js-dist-min' {
  function newPlot(
    div: string | HTMLElement,
    data: any[],
    layout?: any,
    config?: any
  ): Promise<void>
  
  export default {
    newPlot,
  }
}
