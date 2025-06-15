import { Divider, Grid } from "@mui/material";
import { useAppStore } from '@/store/useAppStore';


const sampleData = [
  { key: 1, data: "hello everyone" },
  { key: 2, data: "check 123"},
  { key: 3, data: 'check 54321'},
];

const Dashboard = () => {

  const { role, theme } = useAppStore();

  return (
    <Grid container spacing={1} sx={{ padding: { xs: 2, md: 4 },height: '100vh',width: '100vw',border: '1px solid red' }}>
      {sampleData.map((item) => (
        // Remove 'container' - use only 'item' for grid items
        <Grid height='250px' size={{ xs: 12, md: 3,xl: 3 }} key={item.key}
              sx={{
              backgroundColor: "grey",
              padding: 2,
              borderRadius: 2,
              textAlign: "center",
              flex: 'display',
              flexDirection: 'column'
        }}>
          <div style={{overflow:'hidden',paddingBottom: '14px'}}>
            1234567890123456789012345678901234567890
          </div>
          <Divider/>
          <div style={{paddingTop: '14px',textAlign: 'left'}}>
            <p>{item.data}</p>
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default Dashboard;