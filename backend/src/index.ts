import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(`  MazhaCar Server running on port ${PORT}   `);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'} `);
  console.log(`==========================================`);
});
