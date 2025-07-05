import { Divider, Grid } from "@mui/material";
import { useAppStore } from '@/store/useAppStore';
import { editNote,createNote } from "@/API/notes";


const sampleData = [
  { key: 1, data: "hello everyone" },
  { key: 2, data: "check 123"},
  { key: 3, data: 'check 54321'},
  { key: 4, data: 'check 98765' },
  { key: 5, data: 'check 12345678901234567890' },
  { key: 6, data: 'check 12345678901234567890' },
];

const Dashboard = () => {

  const { role, theme } = useAppStore();

  console.log('check',createNote(1,'hello world','this is a test note'));

  return (
    <>
    <Grid container spacing={2} sx={{ padding: { xs: 2, md: 4 },width: '100%' }}>
      {sampleData.map((item) => (
        // Remove 'container' - use only 'item' for grid items
        <Grid size={{ xs: 12, md: 3,xl: 3 }} key={item.key}
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
    </>
  );
};

export default Dashboard;