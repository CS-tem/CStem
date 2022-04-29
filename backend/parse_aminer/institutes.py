import csv

from config import PATH_DATA

if __name__ == '__main__':
    with open(PATH_DATA + '/constant/country.csv', 'r') as f:
        out = open(PATH_DATA + '/s0/country.csv', 'w')
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

    with open(PATH_DATA + '/constant/institute.csv', 'r') as f:
        out_institute = open(PATH_DATA + '/s0/institute.csv', 'w')
        out_institute_country = open(PATH_DATA + '/s0/institute_country.csv', 'w')
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
