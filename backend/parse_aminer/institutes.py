import csv

from config import CON_COUNTRIES_FILE, CON_INSTITUTIONS_FILE
from config import S0_COUNTRY_FILE, S0_INSTITUTE_FILE, S0_INSTITUTE_COUNTRY_FILE

if __name__ == '__main__':
    with open(CON_COUNTRIES_FILE, 'r') as f:
        out = open(S0_COUNTRY_FILE, 'w')
        out.write('id,name\n')

        id = 0
        csv_reader = csv.reader(f, delimiter=',')
        next(csv_reader)
        country_dict = {}
        for row in csv_reader:
            country_dict[row[0].lower()] = id
            out.write(f'{id},{row[3]}\n')
            id += 1

        out.close()

    with open(CON_INSTITUTIONS_FILE, 'r') as f:
        out_institute = open(S0_INSTITUTE_FILE, 'w')
        out_institute_country = open(S0_INSTITUTE_COUNTRY_FILE, 'w')
        out_institute.write('id,name\n')
        out_institute_country.write('institute_id,country_id\n')

        id = 0
        csv_reader = csv.reader(f, delimiter=',')
        next(csv_reader)
        for row in csv_reader:
            out_institute.write(f'{id},{row[0]}\n')
            out_institute_country.write(f'{id},{country_dict[row[1]]}\n')
            id += 1

        out_institute.close()
        out_institute_country.close()
