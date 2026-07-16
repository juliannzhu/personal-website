**Tabs** — pixel-label tab strip; the active tab fills with the piece color. Controlled.

```jsx
const [tab,setTab] = React.useState('work');
<Tabs value={tab} onChange={setTab} piece="i"
  items={[{value:'work',label:'Work'},{value:'play',label:'Play'}]} />
```
