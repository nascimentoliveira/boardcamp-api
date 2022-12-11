export async function rentalUnfinalizedValidation(req, res, next) {

  const { returnDate } = res.locals.rental;

  if (returnDate) {
    res.status(400).send({ message: 'Este aluguel já está finalizado!' });
    return;
  }

  next();
}