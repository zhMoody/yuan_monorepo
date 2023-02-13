export let arr = []
for (let i = 0; i < 100000; i++) {
  let obj: any = {
    text: `虚拟列表=======> 第${i + 1}个`,
    src: "https://s-3.cn/VAzmA",
  }
  // @ts-ignore
  arr.push(obj)
}
